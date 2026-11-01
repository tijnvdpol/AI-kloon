import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: Props) {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-header__title">{title}</h1>
        <p className="page-header__subtitle">{subtitle}</p>
      </div>
      {action}
    </header>
  );
}
