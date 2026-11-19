"use strict";

const { toCents, fromCents, percentOf } = require("./money");
const { now } = require("./clock");

function parseExpiry(expiresAt) {
  if (!expiresAt) return null;
  const raw = String(expiresAt).trim();
  if (!raw.includes("T")) {
    return new Date(`${raw}T23:59:59.999Z`);
  }
  return new Date(raw);
}

function evaluateCoupon(coupon) {
  if (!coupon || coupon.active === false) {
    return { ok: false, message: "Cupom inválido." };
  }

  if (coupon.expiresAt) {
    const expiry = parseExpiry(coupon.expiresAt);
    if (expiry && !Number.isNaN(expiry.getTime()) && expiry.getTime() < now().getTime()) {
      return { ok: false, message: "Cupom vencido." };
    }
  }

  return { ok: true };
}

function couponBenefit(subtotal, coupon) {
  if (!coupon) return 0;

  if (coupon.type === "percent") {
    return percentOf(subtotal, coupon.value);
  }

  if (coupon.type === "fixed") {
    const benefitCents = toCents(coupon.value);
    const subtotalCents = toCents(subtotal);
    return fromCents(Math.min(benefitCents, subtotalCents));
  }

  return 0;
}

module.exports = {
  evaluateCoupon,
  couponBenefit,
};
