export { Certificate } from "./certificate";
export { LessonProgress } from "./lesson-progress";
export { Tenant } from "./tenant";
export { TenantMember } from "./tenant-member";
export { ProvisionEvent } from "./provision-event";
export { AppliedEvent } from "./applied-event";
export { EmailConsent } from "./email-consent";
export { License } from "./license";
export { NewsletterSubscriber } from "./newsletter-subscriber";
export { Install } from "./install";
export { IssuedBundle } from "./issued-bundle";
export { Revocation } from "./revocation";

import { Certificate } from "./certificate";
import { LessonProgress } from "./lesson-progress";
import { Tenant } from "./tenant";
import { TenantMember } from "./tenant-member";
import { ProvisionEvent } from "./provision-event";
import { AppliedEvent } from "./applied-event";
import { EmailConsent } from "./email-consent";
import { License } from "./license";
import { NewsletterSubscriber } from "./newsletter-subscriber";
import { Install } from "./install";
import { IssuedBundle } from "./issued-bundle";
import { Revocation } from "./revocation";

export const entities = [
  AppliedEvent,
  Certificate,
  EmailConsent,
  Install,
  IssuedBundle,
  LessonProgress,
  License,
  NewsletterSubscriber,
  ProvisionEvent,
  Revocation,
  Tenant,
  TenantMember,
];
