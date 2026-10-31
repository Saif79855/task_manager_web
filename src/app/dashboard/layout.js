export const metadata = {
  title: "Dashboard",
  description: "Manage and organize your personal tasks with TaskFlow.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DashboardLayout({ children }) {
  return children;
}
