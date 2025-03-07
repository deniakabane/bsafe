import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex">
        <Sidebar />
        <main className="flex-1 p-10">{children}</main>
      </body>
    </html>
  );
}
