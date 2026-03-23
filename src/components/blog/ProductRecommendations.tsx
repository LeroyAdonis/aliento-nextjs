/**
 * PHASE 2 — Product Recommendations / Affiliate Component
 * Drop this component anywhere in blog posts or service pages.
 * Plugs into Dis-Chem, Takealot, and Clicks affiliate links.
 *
 * Usage:
 *   <ProductRecommendations items={[
 *     { name: 'Vitamin D3 1000IU', retailer: 'dischem', url: 'https://...', price: 'R89' },
 *   ]} heading="What we recommend" />
 */

interface ProductItem {
  name: string
  description?: string
  retailer: 'dischem' | 'takealot' | 'clicks'
  url: string
  price?: string
  imageUrl?: string
}

interface Props {
  items: ProductItem[]
  heading?: string
}

const RETAILER_STYLES: Record<ProductItem['retailer'], { label: string; color: string }> = {
  dischem: { label: 'Dis-Chem', color: 'bg-green-100 text-green-700' },
  takealot:  { label: 'Takealot',  color: 'bg-blue-100 text-blue-700' },
  clicks:    { label: 'Clicks',    color: 'bg-red-100 text-red-700' },
}

export default function ProductRecommendations({ items, heading = 'Recommended products' }: Props) {
  if (!items || items.length === 0) return null

  return (
    <aside className="my-10 p-6 bg-sand-50 border border-sand-200 rounded-2xl">
      <p className="text-xs font-medium tracking-widest uppercase text-warm-400 mb-4">
        {heading}
      </p>
      <div className="space-y-3">
        {items.map((item) => {
          const r = RETAILER_STYLES[item.retailer]
          return (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center gap-4 p-3 bg-white rounded-xl border border-warm-100 hover:border-warm-300 hover:shadow-sm transition-all"
            >
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-contain rounded-lg flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-warm-900 text-sm truncate">{item.name}</div>
                {item.description && (
                  <div className="text-xs text-warm-400 truncate">{item.description}</div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {item.price && <span className="text-sm font-semibold text-warm-900">{item.price}</span>}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.color}`}>{r.label}</span>
              </div>
            </a>
          )
        })}
      </div>
      <p className="text-xs text-warm-300 mt-3">
        * Aliento may earn a small commission on purchases. This doesn&apos;t affect our recommendations.
      </p>
    </aside>
  )
}

