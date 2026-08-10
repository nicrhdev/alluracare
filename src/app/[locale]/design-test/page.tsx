// src/app/[locale]/design-test/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function DesignTestPage() {
  return (
    <div className="container-custom py-10">
      <h1 className="heading-1 mb-6">Design System Test</h1>
      <p className="body-large mb-8">Testing our new design system</p>

      {/* Buttons */}
      <section className="mb-8">
        <h2 className="heading-2 mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="gold">Gold</Button>
        </div>
      </section>

      {/* Inputs */}
      <section className="mb-8">
        <h2 className="heading-2 mb-4">Inputs</h2>
        <div className="max-w-xs">
          <Input placeholder="Enter your email..." />
        </div>
      </section>

      {/* Cards */}
      <section className="mb-8">
        <h2 className="heading-2 mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Premium skincare</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Clean, minimal design with smooth hover effects.</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>With shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p>More prominent with deeper shadow.</p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Glass Card</CardTitle>
              <CardDescription>Blur effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Frosted glass with backdrop blur.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-8">
        <h2 className="heading-2 mb-4">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="soft">Soft</Badge>
          <Badge variant="gold">Gold</Badge>
          <Badge variant="mint">Mint</Badge>
          <Badge variant="lavender">Lavender</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="warning">Warning</Badge>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-8">
        <h2 className="heading-2 mb-4">Typography</h2>
        <div className="space-y-2">
          <p className="heading-display">Display Heading</p>
          <p className="heading-1">Heading 1</p>
          <p className="heading-2">Heading 2</p>
          <p className="heading-3">Heading 3</p>
          <p className="heading-4">Heading 4</p>
          <p className="body-large">Body Large text</p>
          <p className="body-base">Body Base text</p>
          <p className="body-small">Body Small text</p>
          <p className="caption">Caption text</p>
        </div>
      </section>

      {/* Colors */}
      <section className="mb-8">
        <h2 className="heading-2 mb-4">Brand Colors</h2>
        <div className="flex flex-wrap gap-4">
          <div className="w-20 h-20 rounded-lg" style={{ background: '#874A58' }} />
          <div className="w-20 h-20 rounded-lg" style={{ background: '#C9CAE1' }} />
          <div className="w-20 h-20 rounded-lg" style={{ background: '#EDEDFA' }} />
          <div className="w-20 h-20 rounded-lg" style={{ background: '#B8A2B7' }} />
          <div className="w-20 h-20 rounded-lg" style={{ background: '#FAFAF8', border: '1px solid #ddd' }} />
          <div className="w-20 h-20 rounded-lg" style={{ background: '#C397A0' }} />
          <div className="w-20 h-20 rounded-lg" style={{ background: '#D7B8BF' }} />
          <div className="w-20 h-20 rounded-lg" style={{ background: '#EFDFE2' }} />
        </div>
      </section>
    </div>
  );
}