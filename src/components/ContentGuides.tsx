import { motion } from "framer-motion";
import { BookOpen, Palette, Code2, Image, FileCheck, Search, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

const Section = ({ title, icon, children, delay = 0 }: { title: string; icon: React.ReactNode; children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-card border border-border/40 rounded-xl overflow-hidden"
  >
    <div className="flex items-center gap-2.5 px-5 py-3.5 bg-muted/30 border-b border-border/40">
      <span className="text-primary">{icon}</span>
      <h2 className="font-mono text-sm font-semibold tracking-wide">{title}</h2>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </motion.div>
);

const Rule = ({ ok, text }: { ok: boolean; text: string }) => (
  <div className="flex items-start gap-2.5">
    {ok
      ? <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
      : <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />}
    <span className="text-sm text-muted-foreground font-mono">{text}</span>
  </div>
);

const CodeBlock = ({ code, lang = "" }: { code: string; lang?: string }) => (
  <pre className="bg-muted/50 border border-border/30 rounded-lg p-4 overflow-x-auto text-xs font-mono text-foreground/80 leading-relaxed whitespace-pre-wrap">
    <code>{code}</code>
  </pre>
);

const Tag = ({ color, label }: { color: string; label: string }) => (
  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium" style={{ background: color + "22", color, border: `1px solid ${color}44` }}>
    {label}
  </span>
);

export default function ContentGuides() {
  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
        <h1 className="font-display text-xl font-bold text-foreground">Guía de Contenido — orniturestudio.com</h1>
        <p className="text-sm text-muted-foreground font-mono">Protocolo completo para crear artículos del blog The Design Insider. Sigue este orden exacto.</p>
      </motion.div>

      {/* FLOW */}
      <Section title="Flujo Obligatorio (en este orden)" icon={<ArrowRight className="w-4 h-4" />} delay={0.05}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {["1. Keyword + brief", "2. Generar imágenes fal.ai", "3. Subir a WordPress Media", "4. Escribir HTML con source_url", "5. Rank Math + publicar"].map((step, i) => (
            <div key={i} className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
              <span className="text-xs font-mono text-primary">{step}</span>
            </div>
          ))}
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
          <p className="text-xs font-mono text-red-400 font-semibold">NUNCA usar URLs de fal.ai directamente en el HTML. NUNCA usar rutas locales /root/... Siempre usar source_url devuelta por /wordpress/upload-image</p>
        </div>
      </Section>

      {/* BRAND COLORS */}
      <Section title="Paleta de Marca" icon={<Palette className="w-4 h-4" />} delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { hex: "#a2425e", name: "Burgundy", use: "Headers FAQ, CTA bg, accents" },
            { hex: "#526b6f", name: "Teal", use: "Secundario, bordes, stats" },
            { hex: "#b05236", name: "Terracotta", use: "Highlights, citas" },
            { hex: "#e2e2d7", name: "Cream", use: "Fondos de cards, callouts" },
            { hex: "#ffffff", name: "White", use: "Texto sobre colores oscuros" },
          ].map(c => (
            <div key={c.hex} className="rounded-lg overflow-hidden border border-border/30">
              <div className="h-10 w-full" style={{ background: c.hex }} />
              <div className="p-2 bg-muted/30">
                <p className="text-[11px] font-mono font-bold">{c.hex}</p>
                <p className="text-[10px] font-mono text-muted-foreground">{c.name}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">{c.use}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* IMAGE GENERATION */}
      <Section title="Generación de Imágenes (fal.ai)" icon={<Image className="w-4 h-4" />} delay={0.15}>
        <p className="text-sm text-muted-foreground">Cada artículo necesita <strong className="text-foreground">4 imágenes</strong>: hero (featured), proceso/taller, consultoría/detalle, resultado final.</p>
        <CodeBlock lang="json" code={`POST http://localhost:3001/image/generate
{
  "prompt": "Luxury custom furniture [descripción específica], warm earth tones, professional interior photography, photorealistic, high-end",
  "model": "flux-dev",
  "width": 1200,
  "height": 675
}

// Respuesta: { "images": ["https://v3b.fal.media/..."] }
// GUARDAR esta URL → siguiente paso: upload-image`} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2 font-semibold">Prompts por tipo de imagen:</p>
            <div className="space-y-2 text-xs font-mono text-muted-foreground">
              <p><Tag color="#a2425e" label="HERO" /> Luxury interior showroom, finished room, ambient lighting, photorealistic</p>
              <p><Tag color="#526b6f" label="TALLER" /> Artisan furniture workshop, craftsman, wood shavings, warm lighting</p>
              <p><Tag color="#b05236" label="CONSULTA" /> Interior designer with client, material samples, studio setting</p>
              <p><Tag color="#e2e2d7" label="RESULTADO" /> Completed luxury living/hotel/office space, bespoke furniture, finished project</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2 font-semibold">Upload a WordPress:</p>
            <CodeBlock code={`POST http://localhost:3001/wordpress/upload-image
{
  "image_url": "[URL de fal.ai]",
  "filename": "orniture-[slug-descriptivo].jpg",
  "alt_text": "[keyword + descripción en inglés]"
}
// Respuesta: { "attachment_id": 448, "source_url": "https://orniturestudio.com/wp-content/..." }
// USAR source_url en el HTML, NUNCA la URL de fal.ai`} />
          </div>
        </div>
      </Section>

      {/* HTML PATTERNS */}
      <Section title="Patrones HTML del Artículo" icon={<Code2 className="w-4 h-4" />} delay={0.2}>
        <p className="text-xs font-mono text-muted-foreground">Copiar estos bloques exactos. NO modificar clases wp-block-* ni estructura de figure.</p>

        <div className="space-y-3">
          <p className="text-xs font-mono text-primary font-semibold">IMAGEN HERO (featured_media, no va en content)</p>
          <CodeBlock code={`// Solo se pasa el ID en el payload del post:
{ "featured_media": 448 }`} />

          <p className="text-xs font-mono text-primary font-semibold">IMAGEN ALINEADA DERECHA</p>
          <CodeBlock code={`<figure class="wp-block-image alignright size-large" style="max-width:420px;margin:0 0 1.5rem 2rem">
  <img src="[source_url]" alt="[keyword + descripción]" class="wp-image-[ID]" loading="lazy" width="420"/>
  <figcaption>[Caption descriptivo]</figcaption>
</figure>`} />

          <p className="text-xs font-mono text-primary font-semibold">IMAGEN ALINEADA IZQUIERDA</p>
          <CodeBlock code={`<figure class="wp-block-image alignleft size-large" style="max-width:400px;margin:0 2rem 1.5rem 0">
  <img src="[source_url]" alt="[alt text]" class="wp-image-[ID]" loading="lazy" width="400"/>
  <figcaption>[Caption]</figcaption>
</figure>
// Siempre añadir <div style="clear:both"></div> después de la sección`} />

          <p className="text-xs font-mono text-primary font-semibold">STATS / DATOS CLAVE (4 columnas)</p>
          <CodeBlock code={`<div class="wp-block-columns" style="margin:2rem 0">
  <div class="wp-block-column">
    <div style="background:#e2e2d7;padding:24px;border-radius:10px;text-align:center;border-left:4px solid #a2425e">
      <p style="font-size:2rem;font-weight:700;color:#a2425e;margin:0">40-60%</p>
      <p style="font-size:0.9rem;color:#444;margin:6px 0 0">Descripción del dato</p>
    </div>
  </div>
  // Repetir columnas alternando colores: #a2425e, #526b6f, #b05236, #526b6f
</div>`} />

          <p className="text-xs font-mono text-primary font-semibold">CALLOUT / INSIGHT BOX</p>
          <CodeBlock code={`<div style="background:#e2e2d7;padding:20px 24px;border-radius:8px;border-left:4px solid #b05236;margin:1.5rem 0">
  <p style="margin:0"><strong>Industry insight:</strong> Texto del callout aquí.</p>
</div>`} />

          <p className="text-xs font-mono text-primary font-semibold">FAQ CARDS (bloque completo)</p>
          <CodeBlock code={`<h2>Frequently Asked Questions</h2>
<div style="margin:2rem 0">

  <div style="border-radius:12px;margin-bottom:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
    <div style="background:#a2425e;padding:18px 24px">
      <p style="margin:0;color:#ffffff;font-weight:700;font-size:1rem;line-height:1.4">Pregunta aquí</p>
    </div>
    <div style="background:#ffffff;padding:20px 24px;border-left:4px solid #a2425e">
      <p style="margin:0;color:#333;line-height:1.7">Respuesta aquí.</p>
    </div>
  </div>

  // Alternar colores de header: #a2425e → #526b6f → #b05236 → #a2425e → #526b6f
</div>`} />

          <p className="text-xs font-mono text-primary font-semibold">CTA FINAL (siempre al final)</p>
          <CodeBlock code={`<div style="background:#a2425e;padding:40px 32px;border-radius:14px;text-align:center;margin:3rem 0">
  <h3 style="color:#ffffff;font-size:1.6rem;margin:0 0 12px">Ready to Transform Your Next Project?</h3>
  <p style="color:#e2e2d7;margin:0 0 24px;font-size:1rem">Get a free consultation and quote from our design team. We respond within 24 hours.</p>
  <a href="https://orniturestudio.com/contact/" style="display:inline-block;background:#ffffff;color:#a2425e;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:1rem;letter-spacing:0.02em">Request a Free Consultation</a>
</div>`} />
        </div>
      </Section>

      {/* WRITING RULES */}
      <Section title="Reglas de Escritura" icon={<FileCheck className="w-4 h-4" />} delay={0.25}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Rule ok={false} text="NUNCA usar em-dash ( — ) en el texto visible" />
          <Rule ok={false} text="NUNCA usar asteriscos (*) para enfatizar" />
          <Rule ok={false} text="NUNCA poner H1 dentro del content (el título del post ya es H1)" />
          <Rule ok={false} text="NUNCA poner el excerpt dentro del content" />
          <Rule ok={false} text="NUNCA usar URLs de fal.ai o rutas /root/ como src de imagen" />
          <Rule ok={false} text="NUNCA regenerar imágenes si ya se generaron en la sesión" />
          <Rule ok={true} text="Usar comas o puntos en lugar de em-dash" />
          <Rule ok={true} text="Usar <strong> para énfasis en HTML" />
          <Rule ok={true} text="Mínimo 1500 palabras por artículo" />
          <Rule ok={true} text="Focus keyword en primer párrafo, primer H2, y alt text de imagen principal" />
          <Rule ok={true} text="Siempre añadir 1 link externo (rel=nofollow) y 2 links internos" />
          <Rule ok={true} text="Usar 'to' en lugar de numerales en rangos: '4 to 7 weeks' no '4-7 weeks'" />
          <Rule ok={true} text="Escribir porcentajes: '40 to 60 percent' no '40–60%' en párrafos de texto" />
        </div>
      </Section>

      {/* SEO CHECKLIST */}
      <Section title="Checklist SEO + Rank Math" icon={<Search className="w-4 h-4" />} delay={0.3}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <p className="text-xs font-mono text-primary font-semibold">Payload del post (WordPress API)</p>
            <CodeBlock code={`POST https://orniturestudio.com/wp-json/wp/v2/posts
{
  "title": "[Título sin H1 extra]",
  "content": "[HTML completo con schema JSON-LD al inicio]",
  "excerpt": "[1-2 frases con keyword, sin HTML]",
  "featured_media": [ID attachment hero],
  "categories": [1],
  "slug": "[focus-keyword-con-guiones]",
  "status": "publish"
}`} />
          </div>
          <div className="space-y-3">
            <p className="text-xs font-mono text-primary font-semibold">Rank Math (después de publicar)</p>
            <CodeBlock code={`POST /wp-json/rankmath/v1/updateMeta
{
  "objectID": [post_id],
  "objectType": "post",
  "meta": {
    "rank_math_focus_keyword": "[keyword principal]",
    "rank_math_title": "[Title tag SEO, max 60 chars] | Orniture Studio",
    "rank_math_description": "[Meta desc, 150-160 chars, con keyword]",
    "rank_math_robots": ["index","follow"],
    "rank_math_og_title": "[OG title]",
    "rank_math_og_description": "[OG desc]"
  }
}`} />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-mono text-primary font-semibold">Schema JSON-LD (añadir AL INICIO del content)</p>
          <CodeBlock code={`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Pregunta exacta del FAQ]",
      "acceptedAnswer": { "@type": "Answer", "text": "[Respuesta completa]" }
    }
    // Una entrada por cada FAQ del artículo
  ]
}
</script>`} />
        </div>

        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-xs font-mono text-muted-foreground font-semibold mb-2">Checklist de puntuación alta en Rank Math:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {[
              ["Focus keyword en título SEO", true],
              ["Focus keyword en meta description", true],
              ["Focus keyword en URL/slug", true],
              ["Focus keyword en primer párrafo del content", true],
              ["Focus keyword en al menos un H2", true],
              ["Focus keyword en alt text de imagen principal", true],
              ["Contenido mayor a 1500 palabras", true],
              ["Al menos 1 link interno a orniturestudio.com", true],
              ["Al menos 1 link externo con rel=nofollow", true],
              ["Sin contenido duplicado o thin content", true],
              ["Imagen destacada (featured_media) configurada", true],
              ["Schema FAQPage si hay sección FAQ", true],
            ].map(([label, ok]) => (
              <Rule key={label as string} ok={ok as boolean} text={label as string} />
            ))}
          </div>
        </div>
      </Section>

      {/* ARTICLE STRUCTURE */}
      <Section title="Estructura Ideal del Artículo" icon={<BookOpen className="w-4 h-4" />} delay={0.35}>
        <div className="space-y-2">
          {[
            ["script", "JSON-LD FAQPage schema (antes de todo el contenido visible)"],
            ["p x2", "Introducción: problema + solución. Keyword en primer párrafo."],
            ["figure alignright", "Primera imagen (taller/proceso), alineada derecha"],
            ["h2", "Sección 1: definición/¿qué es? — debe contener focus keyword"],
            ["ul wp-block-list", "Lista de beneficios o características"],
            ["div clear:both", "Limpiar float"],
            ["h2", "Sección 2: por qué/beneficios"],
            ["div wp-block-columns x4", "Bloque de 4 estadísticas con colores de marca"],
            ["div callout", "Insight box con dato de industria"],
            ["h2", "Sección 3: proceso o cómo funciona"],
            ["figure alignleft", "Segunda imagen (consultoría), alineada izquierda"],
            ["ol wp-block-list", "Lista numerada del proceso paso a paso"],
            ["p", "Links internos a orniturestudio.com/contact/ y homepage"],
            ["div clear:both", "Limpiar float"],
            ["h2", "Sección 4: calidad/certificaciones o casos"],
            ["figure aligncenter", "Tercera imagen (resultado), centrada"],
            ["h2", "Investment & Timeline o Comparativa"],
            ["figure wp-block-table", "Tabla comparativa"],
            ["h2", "Frequently Asked Questions (mínimo 5 preguntas)"],
            ["div FAQ cards x5", "Cards estilizados con colores alternos de marca"],
            ["div CTA", "Bloque CTA final con fondo #a2425e y botón blanco"],
          ].map(([tag, desc], i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-32 text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded text-center">{tag as string}</span>
              <span className="text-xs font-mono text-muted-foreground pt-0.5">{desc as string}</span>
            </div>
          ))}
        </div>
      </Section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center py-4"
      >
        <p className="text-[10px] font-mono text-muted-foreground/40 tracking-widest uppercase">
          Orniture Studio · The Design Insider · Content Protocol v1.0
        </p>
      </motion.div>
    </div>
  );
}
