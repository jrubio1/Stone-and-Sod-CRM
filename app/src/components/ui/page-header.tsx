// /src/components/ui/page-header.tsx
interface PageHeaderProps {
    title: string;
    description?: string;
  }
  
  export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted mt-1">{description}</p>}
      </div>
    );
  }