export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl">
            Dojo Genesis is a demonstration product. No user data is stored or
            tracked beyond a temporary device identifier used for session
            management. All conversations are processed by OpenAI&apos;s ChatKit
            service and subject to their privacy policy.
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Dojo Genesis. Part of the Dojo Protocol
            ecosystem. • MVP v1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
