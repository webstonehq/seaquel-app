<script lang="ts">
    import NavHeader from "$lib/components/nav-header.svelte";
    import FooterSection from "$lib/components/footer-section.svelte";
</script>

<svelte:head>
    <title>Privacy Policy - Seaquel</title>
    <meta
        name="description"
        content="Privacy Policy for Seaquel, the modern database client by Webstone Technologies Inc."
    />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
    <NavHeader />

    <div class="pt-16">
        <section class="py-16 md:py-24">
            <div class="container mx-auto px-4 md:px-6 max-w-3xl">
                <h1
                    class="text-3xl md:text-4xl font-bold tracking-tight mb-2"
                >
                    Privacy Policy
                </h1>
                <p class="text-sm text-muted-foreground mb-12">
                    Effective date: February 15, 2026
                </p>

                <div
                    class="prose prose-neutral dark:prose-invert max-w-none
                    [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4
                    [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_p]:mb-4
                    [&_ul]:text-sm [&_ul]:text-muted-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6
                    [&_li]:mb-1
                    [&_strong]:text-foreground"
                >
                    <h2>1. Introduction</h2>
                    <p>
                        Webstone Technologies Inc. ("Webstone", "we", "us", or
                        "our") operates the Seaquel database client ("Software")
                        and the Seaquel website ("Website"). This Privacy Policy
                        describes how we collect, use, and protect your
                        personal information when you use our Software and
                        Website.
                    </p>
                    <p>
                        We are committed to minimizing the data we collect. We
                        do not use analytics, tracking, or telemetry in the
                        Software or on the Website.
                    </p>

                    <h2>2. Information We Collect</h2>
                    <p>
                        We collect personal information only when you make a
                        purchase through our Website. This information is
                        collected and processed by our payment provider, Dodo
                        Payments, and may include:
                    </p>
                    <ul>
                        <li>
                            <strong>Email address</strong> &mdash; used for
                            license delivery and purchase receipts.
                        </li>
                        <li>
                            <strong>Payment information</strong> &mdash;
                            credit card or other payment details, processed
                            entirely by Dodo Payments. We do not store your
                            payment card details.
                        </li>
                        <li>
                            <strong>Name</strong> &mdash; if provided during
                            checkout.
                        </li>
                    </ul>
                    <p>
                        When you activate a commercial license, we receive a
                        license key identifier and an instance identifier to
                        validate your license. We do not collect information
                        about the databases you connect to, your queries, or
                        any other data you work with in the Software.
                    </p>

                    <h2>3. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>
                            Process your purchase and deliver your license key.
                        </li>
                        <li>
                            Activate, validate, and manage your commercial
                            license.
                        </li>
                        <li>
                            Send purchase receipts and license-related
                            communications.
                        </li>
                        <li>
                            Respond to support requests you initiate.
                        </li>
                    </ul>
                    <p>
                        We do not sell, rent, or share your personal
                        information with third parties for marketing purposes.
                    </p>

                    <h2>4. Third-Party Services</h2>
                    <p>We use the following third-party services:</p>
                    <ul>
                        <li>
                            <strong>Dodo Payments</strong> &mdash; processes
                            payments and manages license keys. When you make a
                            purchase, your information is subject to
                            Dodo Payments' privacy policy.
                        </li>
                        <li>
                            <strong>GitHub</strong> &mdash; hosts the
                            Software source code and issue tracker. Any
                            information you share in GitHub issues is subject
                            to GitHub's privacy policy.
                        </li>
                    </ul>

                    <h2>5. Data Retention</h2>
                    <p>
                        We retain license and purchase records for the
                        duration of your license and for a reasonable period
                        afterward to comply with legal and accounting
                        obligations. If you request deletion of your data, we
                        will delete it within 30 days, except where retention
                        is required by law.
                    </p>

                    <h2>6. Your Rights</h2>
                    <p>
                        You have the right to:
                    </p>
                    <ul>
                        <li>
                            <strong>Access</strong> the personal information we
                            hold about you.
                        </li>
                        <li>
                            <strong>Correct</strong> inaccurate or incomplete
                            personal information.
                        </li>
                        <li>
                            <strong>Delete</strong> your personal information,
                            subject to legal retention requirements.
                        </li>
                        <li>
                            <strong>Withdraw consent</strong> where processing
                            is based on your consent.
                        </li>
                    </ul>
                    <p>
                        To exercise any of these rights, contact us using the
                        information in Section 10 below.
                    </p>

                    <h2>7. Children's Privacy</h2>
                    <p>
                        The Software and Website are not directed at children
                        under the age of 13. We do not knowingly collect
                        personal information from children under 13. If you
                        believe a child has provided us with personal
                        information, please contact us and we will delete it.
                    </p>

                    <h2>8. Security</h2>
                    <p>
                        We take reasonable measures to protect your personal
                        information from unauthorized access, alteration,
                        disclosure, or destruction. However, no method of
                        transmission over the Internet or electronic storage
                        is completely secure, and we cannot guarantee absolute
                        security.
                    </p>

                    <h2>9. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time.
                        When we do, we will revise the "Effective date" at the
                        top of this page. Your continued use of the Software
                        or Website after any changes constitutes your
                        acceptance of the updated policy.
                    </p>

                    <h2>10. Contact</h2>
                    <p>
                        If you have questions about this Privacy Policy or
                        wish to exercise your data rights, please open an
                        issue on our
                        <a
                            href="https://github.com/webstonehq/seaquel/issues"
                            target="_blank"
                            class="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                            >GitHub repository</a
                        >
                        or contact us at
                        <a
                            href="mailto:seaquel-legal@webstonehq.com"
                            class="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                            >seaquel-legal@webstonehq.com</a
                        >.
                    </p>
                </div>
            </div>
        </section>

        <FooterSection />
    </div>
</div>
