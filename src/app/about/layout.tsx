export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div style={{ background: 'red' }}>{children}</div>;
}
