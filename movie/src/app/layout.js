import AppChrome from "@/components/AppChrome";
import "./globals.css";

export const metadata = {
  title: "Movie Web Application",
  description: "Simple movie app made with beginner friendly code.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
