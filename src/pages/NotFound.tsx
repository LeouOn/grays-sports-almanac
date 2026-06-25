import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-black text-neutral-50">
      <h1 className="text-4xl font-bold mb-4">⏳ Timeline Not Found</h1>
      <p className="text-neutral-400 mb-8 text-center max-w-md">
        The temporal coordinates you seek don't exist in this continuum.
      </p>
      <Link to="/">
        <Button variant="outline">Return to Present Day</Button>
      </Link>
    </div>
  );
}
