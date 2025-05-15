import { FileManager } from '@/components/file-manager/FileManager';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Ensure Card is imported

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span className="ml-2 text-lg font-bold text-primary">FileSage</span>
          </div>
        </div>
      </header>
      <main className="container mx-auto">
        <FileManager />
      </main>
    </div>
  );
}
