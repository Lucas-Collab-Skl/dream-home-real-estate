export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} Dream Home Real Estate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}