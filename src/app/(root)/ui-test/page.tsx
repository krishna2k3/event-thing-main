import { Button } from "@/components/ui/Button";


const page = ({}) => {
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      <div className="flex gap-4">
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button color="success">Success</Button>
        <Button color="warning">Warning</Button>
        <Button color="danger">Danger</Button>
        <Button color="default">Default</Button>
      </div>
      <div className="flex gap-4">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button>Default</Button>
      </div>
    </main>
  );
};

export default page;
