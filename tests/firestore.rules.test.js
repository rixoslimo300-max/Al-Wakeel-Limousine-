import { readFile } from "node:fs/promises";
import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const PROJECT_ID = "demo-alwakeel-rules-tests";
const OWNER_UID = "customer-uid-1";
const OTHER_UID = "customer-uid-2";
const ADMIN_EMAIL = "eyad.marine30@gmail.com";

let testEnv;

const validBooking = (customerId = OWNER_UID) => ({
  customerId,
  customerName: "Test Customer",
  customerPhone: "+201000000000",
  customerEmail: "customer@example.com",
  serviceId: "transfer-booking",
  serviceName: "الإسكندرية إلى مطار برج العرب",
  vehicleCategoryId: "sedan_comfort",
  pickupLocation: "الإسكندرية",
  dropoffLocation: "مطار برج العرب الدولي",
  pickupDateTime: "2026-12-01T10:00",
  passengersCount: 2,
  luggageCount: 2,
  notes: "",
  status: "pending_review",
  estimatedPrice: 850,
  paymentStatus: "unpaid",
  createdAt: "2026-11-28T10:00:00.000Z",
  serviceCategory: "sedan_comfort",
  serviceCategoryLabel: "سيدان مريحة",
  pricingType: "fixed",
  assignmentStatus: "unassigned",
});

const ownerDb = () => testEnv.authenticatedContext(OWNER_UID).firestore();
const otherDb = () => testEnv.authenticatedContext(OTHER_UID).firestore();
const verifiedAdminDb = () =>
  testEnv.authenticatedContext("admin-uid", {
    email: ADMIN_EMAIL,
    email_verified: true,
  }).firestore();
const unverifiedAdminDb = () =>
  testEnv.authenticatedContext("admin-uid-unverified", {
    email: ADMIN_EMAIL,
    email_verified: false,
  }).firestore();

before(async () => {
  const rules = await readFile(new URL("../firestore.rules", import.meta.url), "utf8");
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules,
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

after(async () => {
  await testEnv?.cleanup();
});

describe("Firestore booking rules", () => {
  it("allows an authenticated customer to create a valid booking for their UID", async () => {
    await assertSucceeds(
      setDoc(doc(ownerDb(), "bookings/booking-valid"), validBooking()),
    );
  });

  it("rejects booking creation by an unauthenticated visitor", async () => {
    await assertFails(
      setDoc(
        doc(testEnv.unauthenticatedContext().firestore(), "bookings/booking-anonymous"),
        validBooking(),
      ),
    );
  });

  it("rejects a customer creating a booking for another UID", async () => {
    await assertFails(
      setDoc(
        doc(ownerDb(), "bookings/booking-spoofed-owner"),
        validBooking(OTHER_UID),
      ),
    );
  });

  it("rejects missing required fields and unexpected extra fields", async () => {
    const missing = validBooking();
    delete missing.customerEmail;
    await assertFails(setDoc(doc(ownerDb(), "bookings/booking-missing"), missing));

    await assertFails(
      setDoc(doc(ownerDb(), "bookings/booking-extra"), {
        ...validBooking(),
        adminNotes: "must not be client supplied",
      }),
    );
  });

  it("rejects invalid status, payment, category, and out-of-range values", async () => {
    await assertFails(
      setDoc(doc(ownerDb(), "bookings/booking-status"), {
        ...validBooking(),
        status: "confirmed",
      }),
    );
    await assertFails(
      setDoc(doc(ownerDb(), "bookings/booking-payment"), {
        ...validBooking(),
        paymentStatus: "paid",
      }),
    );
    await assertFails(
      setDoc(doc(ownerDb(), "bookings/booking-category"), {
        ...validBooking(),
        serviceCategory: "unknown",
      }),
    );
    await assertFails(
      setDoc(doc(ownerDb(), "bookings/booking-passengers"), {
        ...validBooking(),
        passengersCount: 0,
      }),
    );
    await assertFails(
      setDoc(doc(ownerDb(), "bookings/booking-price"), {
        ...validBooking(),
        estimatedPrice: 1000001,
      }),
    );
  });

  it("allows the owner to read their booking but denies another customer", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "bookings/booking-read"), validBooking());
    });

    await assertSucceeds(getDoc(doc(ownerDb(), "bookings/booking-read")));
    await assertFails(getDoc(doc(otherDb(), "bookings/booking-read")));
  });

  it("allows the owner to cancel only the status field", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "bookings/booking-cancel"), validBooking());
    });

    await assertSucceeds(
      updateDoc(doc(ownerDb(), "bookings/booking-cancel"), { status: "cancelled" }),
    );
    await assertFails(
      updateDoc(doc(ownerDb(), "bookings/booking-cancel"), { estimatedPrice: 1 }),
    );
  });

  it("allows only a verified admin with the configured email to read and delete bookings", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "bookings/booking-admin"), validBooking());
    });

    await assertSucceeds(getDoc(doc(verifiedAdminDb(), "bookings/booking-admin")));
    await assertFails(getDoc(doc(unverifiedAdminDb(), "bookings/booking-admin")));
    await assertSucceeds(deleteDoc(doc(verifiedAdminDb(), "bookings/booking-admin")));
  });

  it("denies ordinary customers access to admin-managed collections", async () => {
    await assertFails(
      setDoc(doc(ownerDb(), "pricingRules/customer-write"), { baseRate: 1 }),
    );
    await assertSucceeds(
      setDoc(doc(verifiedAdminDb(), "pricingRules/admin-write"), { baseRate: 1 }),
    );
  });
});
