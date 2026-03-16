import type { PropsWithChildren } from 'react';

export function ControlSection({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <section className="control-section">
      <h3>{title}</h3>
      <div className="control-body">{children}</div>
    </section>
  );
}
