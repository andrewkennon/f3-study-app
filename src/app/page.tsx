import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-md mx-auto p-4 pt-8">
      <h1 className="text-3xl font-black text-center mb-8 tracking-tight">F3 STUDIES</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
        <h2 className="text-xl font-bold mb-2">Welcome, Brother</h2>
        <p className="text-gray-600 mb-6">Find your group or join a new study to get started.</p>
        <Link 
          href="/discovery" 
          className="block w-full bg-black text-white font-bold py-3 rounded text-lg active:bg-gray-800 transition-colors"
        >
          Find a Group
        </Link>
      </div>
    </main>
  );
}