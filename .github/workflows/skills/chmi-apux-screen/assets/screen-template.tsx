// Screen Template — copy, rename, and fill in.
// Path: generations/src/screens/<screen-name>.tsx

import React from 'react';
// Import APUX React wrappers (preferred) — see component-catalogue.md for full list
import { Button, Card } from '../../../packages/apux-react/src';

// -----------------------------------------------------------------------
// Metadata: required by convention
// -----------------------------------------------------------------------
export const metadata = {
  sourceStory: 'packages/apux-storybook/stories/<component>/<story>.ts:<StoryName>',
  generatedAt: new Date().toISOString(),
  args: {
    // Mirror the Storybook story args used to drive rendering
    items: []
  }
};

// -----------------------------------------------------------------------
// Screen component: default export, name must end with "Screen"
// -----------------------------------------------------------------------
export default function ExampleScreen() {
  const { items } = metadata.args as any;

  return (
    <div style={{ padding: 16 }}>
      <h2>Screen Title</h2>

      {/* Card wrapping pattern */}
      <Card>
        {items.map((item: any, i: number) => (
          <div key={i}>{item.label}</div>
        ))}
      </Card>

      {/* Action bar pattern */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <Button variant="primary" icon="plus">Add</Button>
        <Button variant="ghost">Cancel</Button>
      </div>
    </div>
  );
}
