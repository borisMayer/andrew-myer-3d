import { useTranslation } from 'react-i18next';
import { BOOKS } from '../../lib/books';

export default function MobileFallback() {
  const { i18n } = useTranslation();
  const en = i18n.language.startsWith('en');
  const txt = (es: string, english: string) => en ? english : es;
  return <div style={{ minHeight: '100vh', background: '#09080d', color: '#e8dfd0', fontFamily: 'Inter, sans-serif', overflowX: 'clip' }}>
    <a href="#mobile-books" style={{ position: 'absolute', left: -9999 }} onFocus={e => e.currentTarget.style.left='12px'} onBlur={e => e.currentTarget.style.left='-9999px'}>{txt('Ir a los libros','Skip to books')}</a>
    <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(9,8,13,.96)', borderBottom: '1px solid #50452e', padding: '12px clamp(16px,4vw,42px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
      <a href="#mobile-top" style={{ color: '#e8dfd0', fontFamily: 'Georgia,serif', fontSize: 21, textDecoration: 'none' }}>Andrew Myer</a>
      <nav aria-label={txt('Navegación','Navigation')} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <a href="#mobile-books" style={{ color: '#e4c780', fontSize: 13 }}>{txt('Libros','Books')}</a>
        <a href="#mobile-author" style={{ color: '#e4c780', fontSize: 13 }}>{txt('Autor','Author')}</a>
        <button type="button" onClick={()=>i18n.changeLanguage(en?'es':'en')} aria-label={txt('Cambiar a inglés','Switch to Spanish')} style={{ minHeight: 44, minWidth: 48, padding: '8px 12px', background: '#28221a', color: '#f4db9b', border: '1px solid #8a7446', borderRadius: 6, cursor: 'pointer' }}>{en?'ES':'EN'}</button>
      </nav>
    </header>
    <main>
      <section id="mobile-top" style={{ padding: 'clamp(65px,12vw,120px) clamp(20px,5vw,60px)', textAlign: 'center', background: 'radial-gradient(ellipse at center,#292037 0%,#09080d 75%)' }}>
        <p style={{ letterSpacing: 3, color: '#d6b568', fontSize: 12 }}>{txt('LITERATURA · TEOLOGÍA · FILOSOFÍA','LITERATURE · THEOLOGY · PHILOSOPHY')}</p>
        <h1 style={{ fontFamily: 'Georgia,serif', fontWeight: 400, fontSize: 'clamp(48px,10vw,88px)', margin: '20px 0' }}>Andrew Myer</h1>
        <p style={{ maxWidth: 590, margin: '0 auto 28px', lineHeight: 1.7, color: '#c4bbad' }}>{txt('Explora las obras y descubre nuevas perspectivas sobre la existencia, la fe y la condición humana.','Explore the books and discover new perspectives on existence, faith and the human condition.')}</p>
        <a href="#mobile-books" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', background: '#b49b5a', color: '#100e12', fontWeight: 700, borderRadius: 6, textDecoration: 'none' }}>{txt('Explorar libros','Explore books')}</a>
      </section>
      <section id="mobile-books" style={{ maxWidth: 1200, margin: '0 auto', padding: '55px clamp(16px,4vw,48px)', scrollMarginTop: 90 }}>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(28px,5vw,44px)', fontWeight: 400, marginBottom: 10 }}>{txt('Obras publicadas','Published works')}</h2>
        <p style={{ color: '#b8b0a4', marginBottom: 30 }}>{txt('Selecciona una obra para conocerla y visitar Amazon.','Choose a book to explore it and visit Amazon.')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: 20 }}>
          {BOOKS.filter(b=>!b.comingSoon).map(book=><article key={book.id} style={{ background: '#17141c', border: '1px solid #4c4030', borderRadius: 10, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {book.coverImage ? <img src={book.coverImage} alt={txt('Portada de ','Cover of ')+(en?book.titleEn:book.titleEs)} loading="lazy" style={{ width: '100%', maxWidth: 210, aspectRatio: '2 / 3', objectFit: 'cover', alignSelf: 'center', borderRadius: 4 }} /> : <div aria-hidden="true" style={{ height: 240, background: book.coverColor, borderRadius: 4 }} />}
            <p style={{ color: '#d6b568', fontSize: 11, letterSpacing: 1 }}>{en?book.categoryEn:book.categoryEs}</p>
            <h3 style={{ fontFamily: 'Georgia,serif', fontWeight: 400, fontSize: 23 }}>{en?book.titleEn:book.titleEs}</h3>
            <p style={{ color: '#c8c0b6', fontSize: 14, lineHeight: 1.65, flex: 1 }}>{en?(book.descriptionEn||book.description):book.description}</p>
            <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" style={{ minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#b49b5a', color: '#111', fontWeight: 700, textDecoration: 'none', borderRadius: 6 }}>{txt('Ver en Amazon','View on Amazon')} ↗</a>
          </article>)}
        </div>
      </section>
      <section id="mobile-author" style={{ maxWidth: 900, margin: '0 auto', padding: '50px clamp(20px,5vw,60px)', scrollMarginTop: 90 }}>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 34, fontWeight: 400, marginBottom: 15 }}>{txt('Sobre el autor','About the author')}</h2>
        <p style={{ color: '#c8c0b6', lineHeight: 1.85 }}>{txt('Andrew Myer escribe sobre teología, filosofía y experiencias humanas desde una perspectiva interdisciplinaria.','Andrew Myer writes about theology, philosophy and human experience from an interdisciplinary perspective.')}</p>
        <a href="https://www.amazon.com/author/andrewmyer" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', color: '#e4c780', padding: '18px 0', minHeight: 48 }}>{txt('Página del autor en Amazon','Amazon author page')} ↗</a>
      </section>
    </main>
    <footer style={{ padding: 25, textAlign: 'center', borderTop: '1px solid #4c4030', color: '#b8b0a4', fontSize: 12 }}>© {new Date().getFullYear()} Andrew Myer</footer>
  </div>;
}
