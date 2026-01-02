import Link from 'next/link';
import { Lock, ShieldCheck, Award } from 'lucide-react';

const Soc2Logo = ({ className }: { className?: string }) => (
  <svg
    width="40"
    height="24"
    viewBox="0 0 40 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="SOC 2 Certified"
  >
    <path
      d="M27.2721 15.3456L24.5449 12.6184C24.1671 12.2406 23.5518 12.2406 23.174 12.6184L21.4552 14.3372L19.8258 12.7078C19.448 12.33 18.8327 12.33 18.4549 12.7078L13.8177 17.345L12 15.5273V24H20.4727L29.0903 15.3813L27.2721 15.3456ZM20 0L12 3V11.5273C12.3168 11.4544 12.6416 11.418 12.9727 11.418C13.6877 11.418 14.3803 11.5817 15.0003 11.8817L20 6.88197V0ZM30.9097 3L20 13.9097V24H29.0903C35.1267 24 40 19.1267 40 13.0903V7.09031L30.9097 3Z"
      fill="currentColor"
    />
    <path
      d="M8 3V12C8 18.0655 12.9345 23 19 23H20V19C15.0218 19 11 14.9782 11 10V6L8 3Z"
      fill="currentColor"

    />
    <path
      d="M0 7L8 3V11.9345C8 18.0218 12.8727 23 18.9091 23H20V19C15.0218 19 11 14.9782 11 10V6L0 7Z"
      fill="currentColor"
    />
  </svg>
);

const GdprLogo = ({ className }: { className?: string }) => (
  <svg
    width="40"
    height="24"
    viewBox="0 0 40 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="GDPR Compliant"
  >
    <path
      d="M20 0L12 3V12C8 12 0 13 0 24H12V18H16V14H12V12L20 9V0ZM29.2727 3L20 12.2727V24H29.2727C35.2121 24 40 19.1091 40 13.0909V7.09091L29.2727 3Z"
      fill="currentColor"
    />
  </svg>
);

const IsoLogo = ({ className }: { className?: string }) => (
  <svg
    width="68"
    height="24"
    viewBox="0 0 68 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="ISO 27001 Certified"
  >
    <path
      d="M56 0H48V4H52V8H48V12H52V16H48V20H52V24H56V20H60V16H56V12H60V8H56V4H60V0H56ZM20 0L12 3V12C8 12 0 13 0 24H12V18H16V14H12V12L20 9V0ZM44 4V0H20V9L29.0909 3H40V7L29.0909 13.0909L20 22.1818V24H44V20H29.0909L36 13.0909L44 7V4ZM68 0H62V24H68V0Z"
      fill="currentColor"
    />
  </svg>
);

const HipaaLogo = ({ className }: { className?: string }) => (
  <svg
    width="34"
    height="24"
    viewBox="0 0 34 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="HIPAA Certified"
  >
    <path
      d="M17 0L10.2 2.55V10.2C10.2 15.9375 13.209 21.2625 17 24C20.791 21.2625 23.8 15.9375 23.8 10.2V2.55L17 0ZM17 10.725H20.4V13.275H17V16.725H14.45V13.275H11.05V10.725H14.45V7.275H17V10.725Z"
      fill="currentColor"
    />
    <path
      d="M34 7.275L26.35 10.2V14.1375L34 17.025V7.275ZM0 7.275V17.025L7.65 14.1375V10.2L0 7.275Z"
      fill="currentColor"
    />
  </svg>
);

export default function EnterpriseSecuritySection() {
  return (
    <section className="bg-secondary/50 border-b border-border">
      <div className="container mx-auto px-4 py-16 sm:px-8 md:py-24">
        <div className="grid md:grid-cols-2 gap-y-12 gap-x-8 lg:gap-x-16">
          <div className="flex flex-col items-start gap-4">
            <span className="text-primary block text-xs font-bold uppercase tracking-[0.1em]">
              Security & Compliance
            </span>
            <h2 className="text-4xl font-bold leading-[1.2] -tracking-[0.01em] text-foreground">
              Trustworthy, auditable tipping for Web3 payments
            </h2>
            <p className="mt-2 text-muted-foreground">
              AI TipLink delivers end-to-end security: TLS in transit, AES encryption at rest, enterprise-grade key handling, and verifiable audit trails for all tipping flows (on-chain or via hybrid settlement).
            </p>
          </div>

          <div className="flex flex-col gap-10 md:pl-10 lg:pl-20">
            <div className="flex items-start gap-4">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-blue-100 text-primary">
                <Lock className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">Secured funds & transport</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  All tips and payout data are encrypted both in transit (TLS 1.3) and at rest (AES-256). Merchants can choose locally managed or custody-provider solutions for private keys.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-orange-100 text-orange-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">Provable audit & compliance</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Every tip is logged with a verifiable audit trail. On-chain flows attach transaction hashes; hybrid flows anchor digests to blockchain for immutable proof while keeping sensitive payroll data off-chain. Compliance modules support regional rules and privacy controls.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-indigo-100 text-indigo-600">
                <Award className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">Transparent, reliable settlement</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Flexible policy configuration for on-chain, off-chain, or hybrid settlement. Employee portal grants staff full visibility into accruals and split history, ensuring trust and operational efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

