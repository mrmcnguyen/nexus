export default function Layout({ children }) {
    return (
      <div className="flex h-screen mb-4 flex-col md:flex-row md:overflow-y-auto">
        <div className="flex-grow p-6 md:p-4">{children}</div>
      </div>
    );
  }