"use client";

import { Topbar } from "@/components/dashboard/topbar";
import { Star, Calendar, MapPin, ThumbsUp } from "lucide-react";

const reviewStats = { average: 4.8, total: 34, five: 24, four: 8, three: 2, two: 0, one: 0 };

const reviews = [
  {
    id: 1,
    client: "Marie D.",
    rating: 5,
    date: "12 avr. 2026",
    mission: "PV 6kWc",
    city: "Bron",
    comment: "Excellent travail, équipe ponctuelle et soignée. Installation parfaite, je recommande vivement.",
    installer: "LM Energy",
  },
  {
    id: 2,
    client: "Pierre M.",
    rating: 5,
    date: "8 avr. 2026",
    mission: "PAC Air-Eau",
    city: "Lyon 3ème",
    comment: "Très professionnel, chantier propre, explications claires sur le fonctionnement. Rien à redire.",
    installer: "LM Energy",
  },
  {
    id: 3,
    client: "Sophie B.",
    rating: 4,
    date: "2 avr. 2026",
    mission: "Climatisation",
    city: "Villeurbanne",
    comment: "Bon travail dans l'ensemble. Petit retard le premier jour mais rattrapé ensuite.",
    installer: "EcoSolaire Pro",
  },
  {
    id: 4,
    client: "Thomas L.",
    rating: 5,
    date: "28 mar. 2026",
    mission: "ITE",
    city: "Tassin",
    comment: "Chantier impeccable sur 4 jours. L'équipe a été très respectueuse de notre intérieur. Finitions parfaites.",
    installer: "Rénov'Habitat",
  },
  {
    id: 5,
    client: "Claire G.",
    rating: 4,
    date: "20 mar. 2026",
    mission: "PAC Air-Air",
    city: "Caluire",
    comment: "Installation conforme, bon relationnel avec le technicien. RAS.",
    installer: "LM Energy",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`h-3.5 w-3.5 ${s <= rating ? "text-gold-500" : "text-ink-200"}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-ink-500 w-3">{label}</span>
      <Star className="h-3 w-3 text-gold-500" fill="currentColor" />
      <div className="flex-1 h-2 rounded-full bg-cream-200">
        <div className="h-2 rounded-full bg-gold-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-ink-400 w-6 text-right">{count}</span>
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <>
      <Topbar title="Avis" description="Avis clients collectés automatiquement" />

      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Score overview */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-forest-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-5xl font-display font-extrabold text-ink-900">{reviewStats.average}</p>
                <Stars rating={Math.round(reviewStats.average)} />
                <p className="text-xs font-body text-ink-500 mt-2">{reviewStats.total} avis</p>
              </div>
              <div className="flex-1 space-y-2">
                <RatingBar label="5" count={reviewStats.five} total={reviewStats.total} />
                <RatingBar label="4" count={reviewStats.four} total={reviewStats.total} />
                <RatingBar label="3" count={reviewStats.three} total={reviewStats.total} />
                <RatingBar label="2" count={reviewStats.two} total={reviewStats.total} />
                <RatingBar label="1" count={reviewStats.one} total={reviewStats.total} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-forest-100 bg-forest-900 p-6 shadow-sm">
            <h3 className="text-sm font-display font-bold text-cream-50 mb-3">Republication Google</h3>
            <p className="text-sm font-body text-ink-300 leading-relaxed">
              Vos avis sont automatiquement republiés sur votre fiche Google Business Profile pour améliorer votre visibilité locale.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-cream-50/10 flex items-center justify-center">
                <ThumbsUp className="h-5 w-5 text-gold-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-lg font-display font-bold text-cream-50">28 avis</p>
                <p className="text-xs font-body text-ink-400">publiés sur Google</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews list */}
        <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-forest-100">
            <h2 className="text-sm font-display font-bold text-ink-900">Derniers avis</h2>
          </div>
          <div className="divide-y divide-forest-100/50">
            {reviews.map((review) => (
              <div key={review.id} className="px-5 py-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-forest-50 flex items-center justify-center">
                      <span className="text-xs font-body font-semibold text-forest-600">{review.client[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-body font-medium text-ink-900">{review.client}</p>
                      <div className="flex items-center gap-2 text-xs font-body text-ink-400">
                        <span>{review.mission}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{review.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Stars rating={review.rating} />
                    <p className="text-xs font-body text-ink-400 mt-1 flex items-center gap-1 justify-end">
                      <Calendar className="h-3 w-3" />{review.date}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-body text-ink-600 leading-relaxed mt-2 pl-11">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <p className="text-xs font-body text-ink-400 mt-1 pl-11">via {review.installer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
