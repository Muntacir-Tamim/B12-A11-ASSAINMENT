require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 3000;

const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString(
  "utf-8",
);
const serviceAccount = JSON.parse(decoded);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

// middleware
app.use(
  cors({
    origin: [process.env.CLIENT_DOMAIN],
    credentials: true,
    optionSuccessStatus: 200,
  }),
);
app.use(express.json());

// ─── JWT / Firebase Auth Middleware ───────────────────────────────────────────
const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  if (!token) return res.status(401).send({ message: "Unauthorized Access!" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.tokenEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized Access!", err });
  }
};

// ─── MongoDB Client ────────────────────────────────────────────────────────────
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("infrastructuredb");

    const issuesCollection = db.collection("issues");
    const usersCollection = db.collection("users");
    const paymentsCollection = db.collection("payments");
    const timelineCollection = db.collection("timelines");

    // ─── Role Middlewares ────────────────────────────────────────────────────
    const verifyADMIN = async (req, res, next) => {
      const user = await usersCollection.findOne({ email: req.tokenEmail });
      if (user?.role !== "admin")
        return res
          .status(403)
          .send({ message: "Admin only!", role: user?.role });
      next();
    };

    const verifySTAFF = async (req, res, next) => {
      const user = await usersCollection.findOne({ email: req.tokenEmail });
      if (user?.role !== "staff")
        return res
          .status(403)
          .send({ message: "Staff only!", role: user?.role });
      next();
    };

    const verifyADMIN_OR_STAFF = async (req, res, next) => {
      const user = await usersCollection.findOne({ email: req.tokenEmail });
      if (user?.role !== "admin" && user?.role !== "staff")
        return res.status(403).send({ message: "Not authorized!" });
      next();
    };

    // =========================================================================
    // ─── USER ROUTES ──────────────────────────────────────────────────────────
    // =========================================================================

    // Save or update user on login/signup
    app.post("/user", async (req, res) => {
      const userData = req.body;
      userData.created_at = new Date().toISOString();
      userData.last_loggedIn = new Date().toISOString();

      const query = { email: userData.email };
      const alreadyExists = await usersCollection.findOne(query);

      if (alreadyExists) {
        const result = await usersCollection.updateOne(query, {
          $set: { last_loggedIn: new Date().toISOString() },
        });
        return res.send(result);
      }

      // Default role = citizen
      userData.role = "citizen";
      userData.isPremium = false;
      userData.isBlocked = false;
      userData.issueCount = 0;

      const result = await usersCollection.insertOne(userData);
      res.send(result);
    });

    // Get logged-in user's role
    app.get("/user/role", verifyJWT, async (req, res) => {
      const user = await usersCollection.findOne({ email: req.tokenEmail });
      res.send({
        role: user?.role,
        isPremium: user?.isPremium,
        isBlocked: user?.isBlocked,
      });
    });

    // Get logged-in user's full profile
    app.get("/user/me", verifyJWT, async (req, res) => {
      const user = await usersCollection.findOne({ email: req.tokenEmail });
      res.send(user);
    });

    // Update own profile (citizen / staff)
    app.patch("/user/me", verifyJWT, async (req, res) => {
      const { name, image } = req.body;
      const result = await usersCollection.updateOne(
        { email: req.tokenEmail },
        { $set: { name, image } },
      );
      res.send(result);
    });

    // =========================================================================
    // ─── ADMIN: MANAGE CITIZENS ───────────────────────────────────────────────
    // =========================================================================

    // Get all citizens (admin)
    app.get("/admin/citizens", verifyJWT, verifyADMIN, async (req, res) => {
      const citizens = await usersCollection
        .find({ role: "citizen" })
        .toArray();
      res.send(citizens);
    });

    // Block / Unblock a citizen
    app.patch(
      "/admin/citizen/block/:email",
      verifyJWT,
      verifyADMIN,
      async (req, res) => {
        const { email } = req.params;
        const { isBlocked } = req.body;
        const result = await usersCollection.updateOne(
          { email },
          { $set: { isBlocked } },
        );
        res.send(result);
      },
    );

    // =========================================================================
    // ─── ADMIN: MANAGE STAFF ──────────────────────────────────────────────────
    // =========================================================================

    // Create staff account (Firebase + DB)
    app.post("/admin/staff", verifyJWT, verifyADMIN, async (req, res) => {
      const { name, email, phone, image, password } = req.body;
      try {
        // Create Firebase user
        const firebaseUser = await admin.auth().createUser({
          email,
          password,
          displayName: name,
          photoURL: image || "",
        });

        const staffData = {
          uid: firebaseUser.uid,
          name,
          email,
          phone,
          image,
          role: "staff",
          isPremium: false,
          isBlocked: false,
          created_at: new Date().toISOString(),
        };
        const result = await usersCollection.insertOne(staffData);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });

    // Get all staff
    app.get("/admin/staff", verifyJWT, verifyADMIN, async (req, res) => {
      const staff = await usersCollection.find({ role: "staff" }).toArray();
      res.send(staff);
    });

    // Update staff info
    app.patch("/admin/staff/:id", verifyJWT, verifyADMIN, async (req, res) => {
      const { id } = req.params;
      const { name, phone, image } = req.body;
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, phone, image } },
      );
      res.send(result);
    });

    // Delete staff
    app.delete("/admin/staff/:id", verifyJWT, verifyADMIN, async (req, res) => {
      const { id } = req.params;
      const staff = await usersCollection.findOne({ _id: new ObjectId(id) });
      // Delete from Firebase
      if (staff?.uid) {
        try {
          await admin.auth().deleteUser(staff.uid);
        } catch (_) {}
      }
      const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // =========================================================================
    // ─── ISSUES ROUTES ────────────────────────────────────────────────────────
    // =========================================================================

    // Create a new issue (citizen)
    app.post("/issues", verifyJWT, async (req, res) => {
      const citizen = await usersCollection.findOne({ email: req.tokenEmail });

      if (citizen?.isBlocked)
        return res
          .status(403)
          .send({ message: "You are blocked. Contact authorities." });

      const issueCount = await issuesCollection.countDocuments({
        "citizen.email": req.tokenEmail,
      });

      if (!citizen?.isPremium && issueCount >= 3)
        return res
          .status(403)
          .send({ message: "Free limit reached. Please subscribe." });

      const issueData = {
        ...req.body,
        status: "pending",
        priority: "normal",
        upvotes: [],
        upvoteCount: 0,
        isBoosted: false,
        assignedStaff: null,
        createdAt: new Date().toISOString(),
        citizen: {
          name: citizen.name,
          email: citizen.email,
          image: citizen.image,
        },
      };

      const result = await issuesCollection.insertOne(issueData);

      // Timeline entry
      await timelineCollection.insertOne({
        issueId: result.insertedId.toString(),
        status: "pending",
        message: "Issue reported by citizen",
        updatedBy: citizen.name,
        role: "citizen",
        createdAt: new Date().toISOString(),
      });

      res.send(result);
    });

    // Get ALL issues (public) with server-side search, filter, pagination
    app.get("/issues", async (req, res) => {
      const {
        search = "",
        category = "",
        status = "",
        priority = "",
        page = 1,
        limit = 10,
      } = req.query;

      const query = {};
      if (search)
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ];
      if (category) query.category = category;
      if (status) query.status = status;
      if (priority) query.priority = priority;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await issuesCollection.countDocuments(query);

      // Boosted issues first, then by createdAt desc
      const issues = await issuesCollection
        .find(query)
        .sort({ isBoosted: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      res.send({ issues, total, page: parseInt(page), limit: parseInt(limit) });
    });

    // Get single issue
    app.get("/issues/:id", async (req, res) => {
      const { id } = req.params;
      const issue = await issuesCollection.findOne({ _id: new ObjectId(id) });
      res.send(issue);
    });

    // Get my issues (citizen)
    app.get("/my-issues", verifyJWT, async (req, res) => {
      const { status = "", category = "" } = req.query;
      const query = { "citizen.email": req.tokenEmail };
      if (status) query.status = status;
      if (category) query.category = category;
      const issues = await issuesCollection
        .find(query)
        .sort({ isBoosted: -1, createdAt: -1 })
        .toArray();
      res.send(issues);
    });

    // Edit own issue (only if pending)
    app.patch("/issues/:id", verifyJWT, async (req, res) => {
      const { id } = req.params;
      const issue = await issuesCollection.findOne({ _id: new ObjectId(id) });

      if (issue?.citizen?.email !== req.tokenEmail)
        return res.status(403).send({ message: "Forbidden" });
      if (issue?.status !== "pending")
        return res
          .status(400)
          .send({ message: "Can only edit pending issues" });

      const { title, description, category, image, location } = req.body;
      const result = await issuesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, description, category, image, location } },
      );
      res.send(result);
    });

    // Delete own issue
    app.delete("/issues/:id", verifyJWT, async (req, res) => {
      const { id } = req.params;
      const issue = await issuesCollection.findOne({ _id: new ObjectId(id) });
      if (issue?.citizen?.email !== req.tokenEmail)
        return res.status(403).send({ message: "Forbidden" });

      await timelineCollection.deleteMany({ issueId: id });
      const result = await issuesCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // =========================================================================
    // ─── UPVOTE ───────────────────────────────────────────────────────────────
    // =========================================================================

    app.patch("/issues/:id/upvote", verifyJWT, async (req, res) => {
      const { id } = req.params;
      const email = req.tokenEmail;
      const issue = await issuesCollection.findOne({ _id: new ObjectId(id) });

      if (!issue) return res.status(404).send({ message: "Issue not found" });
      if (issue?.citizen?.email === email)
        return res
          .status(400)
          .send({ message: "Cannot upvote your own issue" });

      const citizen = await usersCollection.findOne({ email });
      if (citizen?.isBlocked)
        return res.status(403).send({ message: "You are blocked." });

      const alreadyVoted = issue.upvotes?.includes(email);
      if (alreadyVoted)
        return res.status(409).send({ message: "Already upvoted" });

      const result = await issuesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $addToSet: { upvotes: email }, $inc: { upvoteCount: 1 } },
      );
      res.send(result);
    });

    // =========================================================================
    // ─── ADMIN: ISSUES MANAGEMENT ─────────────────────────────────────────────
    // =========================================================================

    // Get all issues (admin) – same as public but no pagination enforced
    app.get("/admin/issues", verifyJWT, verifyADMIN, async (req, res) => {
      const { status = "", priority = "", category = "" } = req.query;
      const query = {};
      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (category) query.category = category;

      const issues = await issuesCollection
        .find(query)
        .sort({ isBoosted: -1, createdAt: -1 })
        .toArray();
      res.send(issues);
    });

    // Assign staff to issue
    app.patch(
      "/admin/issues/:id/assign",
      verifyJWT,
      verifyADMIN,
      async (req, res) => {
        const { id } = req.params;
        const { staffId } = req.body;

        const staff = await usersCollection.findOne({
          _id: new ObjectId(staffId),
        });
        if (!staff) return res.status(404).send({ message: "Staff not found" });

        const admin_user = await usersCollection.findOne({
          email: req.tokenEmail,
        });

        const result = await issuesCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              assignedStaff: {
                _id: staff._id.toString(),
                name: staff.name,
                email: staff.email,
                image: staff.image,
                phone: staff.phone,
              },
            },
          },
        );

        await timelineCollection.insertOne({
          issueId: id,
          status: "pending",
          message: `Issue assigned to Staff: ${staff.name}`,
          updatedBy: admin_user?.name || "Admin",
          role: "admin",
          createdAt: new Date().toISOString(),
        });

        res.send(result);
      },
    );

    // Reject issue (admin, only pending)
    app.patch(
      "/admin/issues/:id/reject",
      verifyJWT,
      verifyADMIN,
      async (req, res) => {
        const { id } = req.params;
        const admin_user = await usersCollection.findOne({
          email: req.tokenEmail,
        });

        const result = await issuesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "rejected" } },
        );

        await timelineCollection.insertOne({
          issueId: id,
          status: "rejected",
          message: "Issue rejected by admin",
          updatedBy: admin_user?.name || "Admin",
          role: "admin",
          createdAt: new Date().toISOString(),
        });

        res.send(result);
      },
    );

    // =========================================================================
    // ─── STAFF: ISSUE STATUS UPDATE ───────────────────────────────────────────
    // =========================================================================

    // Get assigned issues for staff
    app.get("/staff/issues", verifyJWT, verifySTAFF, async (req, res) => {
      const { status = "", priority = "" } = req.query;
      const query = { "assignedStaff.email": req.tokenEmail };
      if (status) query.status = status;
      if (priority) query.priority = priority;

      const issues = await issuesCollection
        .find(query)
        .sort({ isBoosted: -1, createdAt: -1 })
        .toArray();
      res.send(issues);
    });

    // Update issue status (staff)
    app.patch(
      "/staff/issues/:id/status",
      verifyJWT,
      verifySTAFF,
      async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        const validTransitions = {
          pending: ["in-progress"],
          "in-progress": ["working"],
          working: ["resolved"],
          resolved: ["closed"],
        };

        const issue = await issuesCollection.findOne({ _id: new ObjectId(id) });
        if (!issue) return res.status(404).send({ message: "Issue not found" });

        const allowed = validTransitions[issue.status];
        if (!allowed || !allowed.includes(status))
          return res.status(400).send({
            message: `Cannot change from ${issue.status} to ${status}`,
          });

        const staff = await usersCollection.findOne({ email: req.tokenEmail });

        const result = await issuesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status } },
        );

        await timelineCollection.insertOne({
          issueId: id,
          status,
          message: `Status updated to ${status}`,
          updatedBy: staff?.name || "Staff",
          role: "staff",
          createdAt: new Date().toISOString(),
        });

        res.send(result);
      },
    );

    // =========================================================================
    // ─── TIMELINE ─────────────────────────────────────────────────────────────
    // =========================================================================

    app.get("/timeline/:issueId", async (req, res) => {
      const { issueId } = req.params;
      const timeline = await timelineCollection
        .find({ issueId })
        .sort({ createdAt: -1 })
        .toArray();
      res.send(timeline);
    });

    // =========================================================================
    // ─── PAYMENT: BOOST ISSUE (100 BDT) ──────────────────────────────────────
    // =========================================================================

    app.post("/create-boost-session", verifyJWT, async (req, res) => {
      const { issueId, issueTitle } = req.body;
      const citizen = await usersCollection.findOne({ email: req.tokenEmail });

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "bdt",
              product_data: { name: `Boost Issue: ${issueTitle}` },
              unit_amount: 10000, // 100 BDT in paisa
            },
            quantity: 1,
          },
        ],
        customer_email: citizen?.email,
        mode: "payment",
        metadata: {
          issueId,
          type: "boost",
          citizenEmail: citizen?.email,
          citizenName: citizen?.name,
        },
        success_url: `${process.env.CLIENT_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_DOMAIN}/issues/${issueId}`,
      });

      res.send({ url: session.url });
    });

    // Payment: Premium Subscription (1000 BDT)
    app.post("/create-subscription-session", verifyJWT, async (req, res) => {
      const citizen = await usersCollection.findOne({ email: req.tokenEmail });

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "bdt",
              product_data: { name: "Premium Subscription – Unlimited Issues" },
              unit_amount: 100000, // 1000 BDT
            },
            quantity: 1,
          },
        ],
        customer_email: citizen?.email,
        mode: "payment",
        metadata: {
          type: "subscription",
          citizenEmail: citizen?.email,
          citizenName: citizen?.name,
        },
        success_url: `${process.env.CLIENT_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_DOMAIN}/dashboard/profile`,
      });

      res.send({ url: session.url });
    });

    // Payment success webhook handler
    app.post("/payment-success", async (req, res) => {
      const { sessionId } = req.body;
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      const alreadyProcessed = await paymentsCollection.findOne({
        transactionId: session.payment_intent,
      });
      if (alreadyProcessed)
        return res.send({ transactionId: session.payment_intent });

      if (session.status !== "complete")
        return res.status(400).send({ message: "Payment not complete" });

      const { type, issueId, citizenEmail, citizenName } = session.metadata;

      // Save payment record
      const paymentRecord = {
        transactionId: session.payment_intent,
        type,
        amount: session.amount_total / 100,
        currency: session.currency.toUpperCase(),
        citizenEmail,
        citizenName,
        issueId: issueId || null,
        createdAt: new Date().toISOString(),
      };
      await paymentsCollection.insertOne(paymentRecord);

      if (type === "boost") {
        await issuesCollection.updateOne(
          { _id: new ObjectId(issueId) },
          { $set: { isBoosted: true, priority: "high" } },
        );
        await timelineCollection.insertOne({
          issueId,
          status: "boosted",
          message: "Issue boosted to high priority via payment",
          updatedBy: citizenName,
          role: "citizen",
          createdAt: new Date().toISOString(),
        });
      }

      if (type === "subscription") {
        await usersCollection.updateOne(
          { email: citizenEmail },
          { $set: { isPremium: true } },
        );
      }

      res.send({ transactionId: session.payment_intent });
    });

    // =========================================================================
    // ─── ADMIN: PAYMENTS ──────────────────────────────────────────────────────
    // =========================================================================

    app.get("/admin/payments", verifyJWT, verifyADMIN, async (req, res) => {
      const { type = "", page = 1, limit = 20 } = req.query;
      const query = {};
      if (type) query.type = type;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await paymentsCollection.countDocuments(query);
      const payments = await paymentsCollection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      res.send({ payments, total });
    });

    // Get my payments (citizen)
    app.get("/my-payments", verifyJWT, async (req, res) => {
      const payments = await paymentsCollection
        .find({ citizenEmail: req.tokenEmail })
        .sort({ createdAt: -1 })
        .toArray();
      res.send(payments);
    });

    // =========================================================================
    // ─── ADMIN: DASHBOARD STATS ───────────────────────────────────────────────
    // =========================================================================

    app.get("/admin/stats", verifyJWT, verifyADMIN, async (req, res) => {
      const totalIssues = await issuesCollection.countDocuments();
      const pendingIssues = await issuesCollection.countDocuments({
        status: "pending",
      });
      const resolvedIssues = await issuesCollection.countDocuments({
        status: "resolved",
      });
      const rejectedIssues = await issuesCollection.countDocuments({
        status: "rejected",
      });
      const closedIssues = await issuesCollection.countDocuments({
        status: "closed",
      });

      const paymentsAgg = await paymentsCollection
        .aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])
        .toArray();
      const totalRevenue = paymentsAgg[0]?.total || 0;

      const latestIssues = await issuesCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();
      const latestPayments = await paymentsCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();
      const latestUsers = await usersCollection
        .find({ role: "citizen" })
        .sort({ created_at: -1 })
        .limit(5)
        .toArray();

      res.send({
        totalIssues,
        pendingIssues,
        resolvedIssues,
        rejectedIssues,
        closedIssues,
        totalRevenue,
        latestIssues,
        latestPayments,
        latestUsers,
      });
    });

    // ─── Citizen Dashboard Stats ─────────────────────────────────────────────
    app.get("/citizen/stats", verifyJWT, async (req, res) => {
      const email = req.tokenEmail;
      const total = await issuesCollection.countDocuments({
        "citizen.email": email,
      });
      const pending = await issuesCollection.countDocuments({
        "citizen.email": email,
        status: "pending",
      });
      const inProgress = await issuesCollection.countDocuments({
        "citizen.email": email,
        status: "in-progress",
      });
      const resolved = await issuesCollection.countDocuments({
        "citizen.email": email,
        status: "resolved",
      });
      const payments = await paymentsCollection
        .find({ citizenEmail: email })
        .toArray();
      const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

      res.send({ total, pending, inProgress, resolved, totalPaid });
    });

    // ─── Staff Dashboard Stats ───────────────────────────────────────────────
    app.get("/staff/stats", verifyJWT, verifySTAFF, async (req, res) => {
      const email = req.tokenEmail;
      const assigned = await issuesCollection.countDocuments({
        "assignedStaff.email": email,
      });
      const resolved = await issuesCollection.countDocuments({
        "assignedStaff.email": email,
        status: "resolved",
      });
      const closed = await issuesCollection.countDocuments({
        "assignedStaff.email": email,
        status: "closed",
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTasks = await issuesCollection.countDocuments({
        "assignedStaff.email": email,
        createdAt: { $gte: today.toISOString() },
      });

      res.send({ assigned, resolved, closed, todayTasks });
    });

    // ─── Latest Resolved Issues (Homepage) ──────────────────────────────────
    app.get("/latest-resolved", async (req, res) => {
      const issues = await issuesCollection
        .find({ status: "resolved" })
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();
      res.send(issues);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log("Successfully connected to MongoDB!");
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Public Infrastructure Issue Reporting System – Server Running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
