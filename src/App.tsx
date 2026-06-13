/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

// Import actual book cover image assets
import paranaEs from './assets/images/parana_es_1781302740605.jpg';
import paranaEn from './assets/images/parana_en_1781302753534.jpg';
import iaraCover from './assets/images/iara_cover_1781302772227.jpg';
import ingenieriaEs from './assets/images/ingenieria_es_1781302790428.jpg';
import ingenieriaEn from './assets/images/ingenieria_en_1781302803993.jpg';
import trilogiaEs from './assets/images/trilogia_es_1781302818937.jpg';
import trilogiaEn from './assets/images/trilogia_en_1781302834741.jpg';

// Textos e internacionalización idénticos a los del script original de Codepen
const textos = {
  es: {
    titulo: 'El Paraná en solitario',
    promo: 'Una historia de coraje y naturaleza. Acompaña esta travesía única a través de sus páginas.',
    btnComprar: 'Comprar Libro',
    librosTitulo: 'Nuestros Libros',
    txtSocial: 'Seguime en mis redes sociales',
    b1: 'El Paraná en solitario',
    b2: 'El Mandarina, Iara y Gus',
    sub2: '(Fábula para chicos)',
    b3: 'Ingeniería inversa de la identidad',
    tag3: '¡REGALO EXCLUSIVO!',
    b4: 'Combo: Trilogía',
    tag4: '¡MEJOR OPCIÓN!',
    btnVolver: '← Volver al inicio',
    regaloT: '¡LIBRO DE REGALO!',
    regaloP: 'Este libro no está a la venta individualmente. Es un regalo exclusivo para quienes compran el Combo de 3 Libros.',
    regaloB: '¡VER COMBO AHORA!',
    img1: paranaEs,
    img2: iaraCover,
    img3: ingenieriaEs,
    img4: trilogiaEs
  },
  en: {
    titulo: 'The Paraná in solitude',
    promo: 'A story of courage and nature. Join this unique journey through its pages.',
    btnComprar: 'Buy Book',
    librosTitulo: 'Our Books',
    txtSocial: 'Follow me on social media',
    b1: 'The Paraná in solitude',
    b2: "The 'Mandarina', Iara and Gus",
    sub2: '(Fable for children)',
    b3: 'Reverse engineering of identity',
    tag3: 'EXCLUSIVE GIFT!',
    b4: 'Combo: Trilogy',
    tag4: 'BEST CHOICE!',
    btnVolver: '← Back to Home',
    regaloT: 'FREE GIFT BOOK!',
    regaloP: 'This book is not for sale individually. It is an exclusive gift for those who buy the 3-Book Combo!',
    regaloB: 'SEE COMBO NOW!',
    img1: paranaEn,
    img2: iaraCover,
    img3: ingenieriaEn,
    img4: trilogiaEn
  }
};

export default function App() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [screen, setScreen] = useState<'principal' | 'compra'>('principal');
  const [activeModal, setActiveModal] = useState<'pago' | 'regalo' | null>(null);
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});

  // Estado para capturar imágenes subidas por el usuario interactivamente (tanto de localStorage como del servidor)
  const [covers, setCovers] = useState({
    parana_es: localStorage.getItem('cover_parana_es') || '',
    parana_en: localStorage.getItem('cover_parana_en') || '',
    iara: localStorage.getItem('cover_iara') || '',
    ingenieria_es: localStorage.getItem('cover_ingenieria_es') || '',
    ingenieria_en: localStorage.getItem('cover_ingenieria_en') || '',
    trilogia_es: localStorage.getItem('cover_trilogia_es') || '',
    trilogia_en: localStorage.getItem('cover_trilogia_en') || '',
  });

  const [serverCovers, setServerCovers] = useState<{[key: string]: boolean}>({});
  const [showAdmin, setShowAdmin] = useState(false);

  React.useEffect(() => {
    // 1. Detectar si entramos de forma administrativa
    const params = new URLSearchParams(window.location.search);
    if (params.has('gustavo') || params.has('admin') || params.has('editor') || params.has('edit')) {
      setShowAdmin(true);
    }

    // 2. Consultar qué portadas personalizadas están guardadas físicamente en el servidor
    fetch('/api/custom-covers')
      .then(res => {
        if (!res.ok) throw new Error("HTTP state " + res.status);
        return res.json();
      })
      .then(data => {
        if (data && typeof data === 'object') {
          setServerCovers(data);
        }
      })
      .catch(err => console.error("Could not fetch server covers", err));
  }, []);

  const handleImageUpload = (key: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        // 1. Guardar localmente para feedback inmediato
        localStorage.setItem(`cover_${key}`, result);
        setCovers(prev => ({ ...prev, [key]: result }));

        // 2. Subir físicamente al servidor en segundo plano
        fetch('/api/upload-cover', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ key, base64: result })
        })
        .then(res => res.json())
        .then(data => {
          if (data && data.success) {
            console.log("Cover replicated successfully to server!");
            setServerCovers(prev => ({ ...prev, [key]: true }));
          }
        })
        .catch(err => console.error("Error uploading cover to container backend", err));
      }
    };
    reader.readAsDataURL(file);
  };

  const copiarAlPortapapeles = (texto: string, key: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto)
        .then(() => {
          setCopiedStates(prev => ({ ...prev, [key]: true }));
          setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2000);
        })
        .catch(() => {
          fallbackCopiar(texto, key);
        });
    } else {
      fallbackCopiar(texto, key);
    }
  };

  const fallbackCopiar = (text: string, key: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.fontSize = '12pt';
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setCopiedStates(prev => ({ ...prev, [key]: true }));
        setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2000);
      }
    } catch (err) {
      console.error("Unable to copy", err);
    }
  };

  const copiarEmail = () => {
    copiarAlPortapapeles('elparanaensolitario@gmail.com', 'email');
  };

  const t = textos[lang];

  // Nombres de archivos estáticos mapeados para no-caché en el servidor
  const serverFilenames = {
    parana_es: 'parana_es.jpg',
    parana_en: 'parana_en.jpg',
    iara: 'iara.jpg',
    ingenieria_es: 'ingenieria_es.jpg',
    ingenieria_en: 'ingenieria_en.jpg',
    trilogia_es: 'trilogia_es.jpg',
    trilogia_en: 'trilogia_en.jpg'
  };

  const getCoverSrc = (key: keyof typeof serverFilenames, fallback: string) => {
    // A. Prioridad 1: LocalStorage del usuario que sube
    if (covers[key]) {
      return covers[key];
    }
    // B. Prioridad 2: Archivo físico servido por el servidor
    if (serverCovers[key]) {
      return `/custom-covers/${serverFilenames[key]}`;
    }
    // C. Prioridad 3: Fallback de Vite
    return fallback;
  };

  // Las portadas maestras fijas que importamos directamente desde el código
  const img1Src = lang === 'es' ? getCoverSrc('parana_es', paranaEs) : getCoverSrc('parana_en', paranaEn);
  const img2Src = getCoverSrc('iara', iaraCover);
  const img3Src = lang === 'es' ? getCoverSrc('ingenieria_es', ingenieriaEs) : getCoverSrc('ingenieria_en', ingenieriaEn);
  const img4Src = lang === 'es' ? getCoverSrc('trilogia_es', trilogiaEs) : getCoverSrc('trilogia_en', trilogiaEn);

  // Aplicar idioma
  const aplicarIdioma = (newLang: 'es' | 'en') => {
    setLang(newLang);
  };

  // Gestión de pago e inicio
  const gestionarPago = (id: number) => {
    if (id === 3) {
      setActiveModal('regalo');
      return;
    }
    setSelectedBook(id);
    setActiveModal('pago');
  };

  const irACompra = () => {
    setScreen('compra');
  };

  const irAInicio = () => {
    setScreen('principal');
  };

  const cerrarPago = () => {
    setActiveModal(null);
    setSelectedBook(null);
  };

  const cerrarRegalo = () => {
    setActiveModal(null);
  };

  const irAlCombo = () => {
    cerrarRegalo();
    gestionarPago(4);
  };

  // Precios cruzados por idioma
  const getPrecio = (id: number) => {
    if (id === 1 || id === 2) {
      return lang === 'es' ? '$20.000' : 'USD 20';
    }
    if (id === 4) {
      return lang === 'es' ? '$30.000' : 'USD 30';
    }
    return '-';
  };

  const getNombreLibro = (id: number) => {
    if (id === 1) return t.b1;
    if (id === 2) return t.b2;
    if (id === 3) return t.b3;
    if (id === 4) return t.b4;
    return '';
  };

  // Asunto dinámico del correo según el libro seleccionado
  const asuntoEmail = selectedBook 
    ? (lang === 'es' 
        ? `Libro [${getNombreLibro(selectedBook)}]` 
        : `Book [${getNombreLibro(selectedBook)}]`)
    : (lang === 'es' ? 'Libro' : 'Book');

  return (
    <div className="container" id="main-container">
      {/* Selector de idioma */}
      <div className="language-picker" id="lang-picker" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <button
          id="btn-es"
          className={`lang-btn ${lang === 'es' ? 'active' : ''}`}
          onClick={() => aplicarIdioma('es')}
        >
          ES
        </button>
        <button
          id="btn-en"
          className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
          onClick={() => aplicarIdioma('en')}
        >
          EN
        </button>
      </div>

      {/* PANTALLA PRINCIPAL */}
      {screen === 'principal' && (
        <div id="pantalla-principal">
          <div className="header-main">
            <h1 id="txt-titulo">{t.titulo}</h1>
            <p id="txt-promo" className="propaganda">{t.promo}</p>
          </div>
          
          <div className="cta-main">
            <button id="btn-comprar" className="btn-principal" onClick={irACompra}>
              {t.btnComprar}
            </button>
          </div>
        </div>
      )}

      {/* PANTALLA DE COMPRA */}
      {screen === 'compra' && (
        <div id="pantalla-compra" style={{ width: '100%' }}>
          <h2 id="txt-libros-titulo">{t.librosTitulo}</h2>
          <div className="grid-compra">
              
              {/* Libro 1 */}
              <div className="opcion" onClick={() => gestionarPago(1)} id="opcion-libro-1">
                  <img id="img-l1" src={img1Src} alt={t.b1} className="tapa-libro" referrerPolicy="no-referrer" />
                  <div className="info-libro">
                      <strong id="txt-b1">{t.b1}</strong>
                  </div>
                  <div className="precio" id="pr-1">{getPrecio(1)}</div>
              </div>
              
              {/* Libro 2 */}
              <div className="opcion" onClick={() => gestionarPago(2)} id="opcion-libro-2">
                  <img id="img-l2" src={img2Src} alt={t.b2} className="tapa-libro" referrerPolicy="no-referrer" />
                  <div className="info-libro">
                      <strong id="txt-b2">{t.b2}</strong>
                      <small id="txt-sub2">{t.sub2}</small>
                  </div>
                  <div className="precio" id="pr-2">{getPrecio(2)}</div>
              </div>
              
              {/* Libro 3 - Regalo */}
              <div className="opcion" onClick={() => gestionarPago(3)} style={{ borderStyle: 'dashed' }} id="opcion-libro-3">
                  <img id="img-l3" src={img3Src} alt={t.b3} className="tapa-libro" referrerPolicy="no-referrer" />
                  <div className="info-libro">
                      <strong id="txt-b3">{t.b3}</strong>
                  </div>
                  <div className="precio" id="pr-3">-</div>
                  <span id="txt-tag3" className="promo-tag">{t.tag3}</span>
              </div>
              
              {/* Combo Trilogía */}
              <div className="opcion" style={{ border: '2px solid #E67E22' }} onClick={() => gestionarPago(4)} id="opcion-libro-4">
                  <img id="img-l4" src={img4Src} alt={t.b4} className="tapa-libro" referrerPolicy="no-referrer" />
                  <div className="info-libro">
                      <strong id="txt-b4">{t.b4}</strong>
                  </div>
                  <div className="precio" id="pr-4">{getPrecio(4)}</div>
                  <span id="txt-tag4" className="promo-tag">{t.tag4}</span>
              </div>
          </div>
          <button id="btn-volver" className="btn-volver" onClick={irAInicio}>
            {t.btnVolver}
          </button>
        </div>
      )}

      {/* REDES SOCIALES GLOBALES (SIEMPRE VISIBLES ABAJO) */}
      <div className="seccion-redes">
        <div id="txt-social" className="titulo-redes">{t.txtSocial}</div>
        <div className="social-footer">
          <a href="https://www.youtube.com/@GustavoDipr%C3%A9" target="_blank" rel="noopener noreferrer" className="social-icon" title="YouTube">
            <i className="fab fa-youtube"></i>
          </a>
          <a href="https://www.instagram.com/elparanaensolitario" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.tiktok.com/@elparanaensolitario" target="_blank" rel="noopener noreferrer" className="social-icon" title="TikTok">
            <i className="fab fa-tiktok"></i>
          </a>
          <a href="https://www.facebook.com/elparanaensolitario" target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook">
            <i className="fab fa-facebook"></i>
          </a>
        </div>
      </div>

      {/* MODAL DE PAGO */}
      {activeModal === 'pago' && selectedBook !== null && (
        <div id="modalPago" className="modal" style={{ display: 'flex' }}>
          <div className="modal-content" id="modal-pago-content">
              {/* Botón de cierre superior (X) */}
              <button 
                className="modal-close-x" 
                onClick={cerrarPago}
                id="btn-modal-close-x"
                title={lang === 'es' ? 'Cerrar' : 'Close'}
              >
                ✕
              </button>
              {/* Fondo semi-transparente con la tapa del libro */}
              <div 
                className="modal-cover-bg" 
                style={{ 
                  backgroundImage: `url(${selectedBook === 1 ? img1Src : selectedBook === 2 ? img2Src : selectedBook === 4 ? img4Src : ''})` 
                }} 
              />
              <div style={{ position: 'relative', zIndex: 10 }}>
                  <h3 id="modal-titulo-libro" style={{ color: '#E67E22', marginBottom: '5px' }}>
                    {getNombreLibro(selectedBook)}
                  </h3>
                  <div id="modal-precio-display" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '20px', color: '#ff9d42' }}>
                    {getPrecio(selectedBook)}
                  </div>
                  
                  {lang === 'es' ? (
                    <div id="opciones-es">
                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Transferencia (Mercado Pago):</p>
                        <div className="bank-box" style={{ 
                          borderColor: '#009EE3', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '10px', 
                          padding: '14px',
                          background: 'rgba(0, 158, 227, 0.03)',
                          border: '1.5px solid #009EE3'
                        }}>
                            <div>Titular: <b>Gustavo Cristian Dipré</b></div>
                            <div 
                              onClick={() => copiarAlPortapapeles('avesvivenlibres', 'alias')}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                background: 'rgba(0, 158, 227, 0.08)',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(0, 158, 227, 0.25)',
                                transition: 'all 0.2s',
                                userSelect: 'all'
                              }}
                              className="copyable-item"
                              title="Haz clic para copiar el alias"
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontSize: '0.7rem', color: '#8da499', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  Alias de Mercado Pago
                                </span>
                                <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#009EE3' }}>
                                  avesvivenlibres
                                </span>
                              </div>
                              <div style={{
                                background: copiedStates['alias'] ? '#2e7d32' : 'rgba(0, 158, 227, 0.15)',
                                color: copiedStates['alias'] ? '#ffffff' : '#009EE3',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                minWidth: '76px',
                                textAlign: 'center',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }}>
                                {copiedStates['alias'] ? '¡Copiado! ✓' : 'Copiar 📋'}
                              </div>
                            </div>
                        </div>
                        <div className="instruccion-mail">
                            <strong style={{ display: 'block', marginBottom: '8px', color: '#E67E22', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                              ¡PASO FINAL! Envía tu comprobante:
                            </strong>
                            
                            {/* Caja interactiva de copiado con feedback visual */}
                            <div 
                              onClick={copiarEmail}
                              className="email-interactive-box"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: '#111614',
                                border: '1.5px solid #2a3831',
                                borderRadius: '10px',
                                padding: '10px 12px',
                                cursor: 'pointer',
                                margin: '8px 0 14px 0',
                                transition: 'all 0.2s ease',
                                userSelect: 'all'
                              }}
                              title="Haz clic para copiar el correo"
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontSize: '0.7rem', color: '#8da499', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  Copiar correo electrónico
                                </span>
                                <span style={{ fontSize: '0.98rem', fontWeight: 'bold', color: '#ffffff', wordBreak: 'break-all' }}>
                                  elparanaensolitario@gmail.com
                                </span>
                              </div>
                              <div style={{
                                background: copiedStates['email'] ? '#2e7d32' : '#24302a',
                                color: copiedStates['email'] ? '#ffffff' : '#ff9d42',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                minWidth: '82px',
                                textAlign: 'center',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }}>
                                {copiedStates['email'] ? '¡Copiado! ✓' : 'Copiar 📋'}
                              </div>
                            </div>

                            {/* Accesos directos a webmails para garantizar compatibilidad total en Web/Móvil */}
                            <p style={{ fontSize: '0.82rem', color: '#ff9d42', margin: '14px 0 8px 0', fontWeight: 'bold', textAlign: 'center' }}>
                              Redactar mensaje directamente desde tu webmail preferido:
                            </p>
                            <div style={{ 
                              display: 'grid', 
                              gridTemplateColumns: 'repeat(3, 1fr)', 
                              gap: '6px',
                              marginBottom: '14px'
                            }}>
                              <a 
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=elparanaensolitario@gmail.com&su=${encodeURIComponent(asuntoEmail)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="webmail-btn"
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'rgba(230, 126, 34, 0.08)',
                                  color: '#ff9d42',
                                  border: '1px solid rgba(230, 126, 34, 0.25)',
                                  padding: '8px 4px',
                                  borderRadius: '8px',
                                  fontSize: '0.72rem',
                                  fontWeight: 'bold',
                                  textDecoration: 'none',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <span style={{ fontSize: '1rem', marginBottom: '2px' }}>🌐</span> Gmail Web
                              </a>
                              <a 
                                href={`https://outlook.live.com/default.aspx?rru=compose&to=elparanaensolitario@gmail.com&subject=${encodeURIComponent(asuntoEmail)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="webmail-btn"
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'rgba(230, 126, 34, 0.08)',
                                  color: '#ff9d42',
                                  border: '1px solid rgba(230, 126, 34, 0.25)',
                                  padding: '8px 4px',
                                  borderRadius: '8px',
                                  fontSize: '0.72rem',
                                  fontWeight: 'bold',
                                  textDecoration: 'none',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <span style={{ fontSize: '1rem', marginBottom: '2px' }}>✉️</span> Outlook
                              </a>
                              <a 
                                href={`https://compose.mail.yahoo.com/?to=elparanaensolitario@gmail.com&subj=${encodeURIComponent(asuntoEmail)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="webmail-btn"
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'rgba(230, 126, 34, 0.08)',
                                  color: '#ff9d42',
                                  border: '1px solid rgba(230, 126, 34, 0.25)',
                                  padding: '8px 4px',
                                  borderRadius: '8px',
                                  fontSize: '0.72rem',
                                  fontWeight: 'bold',
                                  textDecoration: 'none',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <span style={{ fontSize: '1rem', marginBottom: '2px' }}>💜</span> Yahoo
                              </a>
                            </div>

                            <div className="aclaracion-manual" style={{ textAlign: 'left', lineHeight: '1.5' }}>
                              Gracias por sumarte a esta travesía. Como hago el envío de forma personal, te pido un poquito de paciencia. Para enviarte tu enlace lo antes posible, por favor, haz lo siguiente al escribirme:
                              <ol style={{ paddingLeft: '22px', marginTop: '10px', listStyleType: 'decimal', fontStyle: 'normal' }}>
                                <li style={{ marginBottom: '6px' }}>En el asunto del correo escribe: <strong style={{ color: '#E67E22' }}>"Libro [{getNombreLibro(selectedBook)}]"</strong>.</li>
                                <li style={{ marginBottom: '6px' }}>Adjunta el comprobante de pago/transferencia.</li>
                                <li style={{ marginBottom: '6px' }}>Disfruta de la lectura.</li>
                              </ol>
                            </div>

                            {/* Botón de volver/cerrar exclusivo bajo la pestaña/contenedor de pago */}
                            <button
                              id="btn-volver-pago-es"
                              className="btn-volver"
                              onClick={cerrarPago}
                              style={{
                                width: '100%',
                                marginTop: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                background: '#1c2622',
                                color: '#eae3d5',
                                border: '1px solid #2a3831',
                                padding: '12px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                transition: '0.2s'
                              }}
                            >
                              ← {t.btnVolver}
                            </button>
                        </div>
                    </div>
                  ) : (
                    <div id="opciones-en">
                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Bank Transfer (USA):</p>
                        <div className="bank-box" style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '10px', 
                          padding: '14px',
                          background: 'rgba(230, 126, 34, 0.03)',
                          border: '1.5px solid #2a3831'
                        }}>
                            <div>Holder: <b>Gustavo Cristian Dipré</b></div>
                            <div>Bank: <b>Regent Bank</b></div>
                            
                            {/* Copyable Account Number */}
                            <div 
                              onClick={() => copiarAlPortapapeles('123704110058', 'account')}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                background: 'rgba(230, 126, 34, 0.08)',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(230, 126, 34, 0.25)',
                                transition: 'all 0.2s',
                                userSelect: 'all'
                              }}
                              className="copyable-item"
                              title="Click to copy account number"
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontSize: '0.7rem', color: '#8da499', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  Account Number (Nº Cuenta)
                                </span>
                                <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#E67E22' }}>
                                  123704110058
                                </span>
                              </div>
                              <div style={{
                                background: copiedStates['account'] ? '#2e7d32' : 'rgba(230, 126, 34, 0.15)',
                                color: copiedStates['account'] ? '#ffffff' : '#E67E22',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                minWidth: '76px',
                                textAlign: 'center',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }}>
                                {copiedStates['account'] ? 'Copied! ✓' : 'Copy 📋'}
                              </div>
                            </div>

                            {/* Copyable Routing Number */}
                            <div 
                              onClick={() => copiarAlPortapapeles('103913434', 'routing')}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                background: 'rgba(230, 126, 34, 0.08)',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(230, 126, 34, 0.25)',
                                transition: 'all 0.2s',
                                userSelect: 'all'
                              }}
                              className="copyable-item"
                              title="Click to copy routing number"
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontSize: '0.7rem', color: '#8da499', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  Routing Number (ACH)
                                </span>
                                <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#E67E22' }}>
                                  103913434
                                </span>
                              </div>
                              <div style={{
                                background: copiedStates['routing'] ? '#2e7d32' : 'rgba(230, 126, 34, 0.15)',
                                color: copiedStates['routing'] ? '#ffffff' : '#E67E22',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                minWidth: '76px',
                                textAlign: 'center',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }}>
                                {copiedStates['routing'] ? 'Copied! ✓' : 'Copy 📋'}
                              </div>
                            </div>
                        </div>

                        <div className="instruccion-mail">
                            <strong style={{ display: 'block', marginBottom: '8px', color: '#E67E22', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                              FINAL STEP! Send confirmation:
                            </strong>
                            
                            {/* Interactive copy-email block */}
                            <div 
                              onClick={copiarEmail}
                              className="email-interactive-box"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: '#111614',
                                border: '1.5px solid #2a3831',
                                borderRadius: '10px',
                                padding: '10px 12px',
                                cursor: 'pointer',
                                margin: '8px 0 14px 0',
                                transition: 'all 0.2s ease',
                                userSelect: 'all'
                              }}
                              title="Click to copy email address"
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontSize: '0.7rem', color: '#8da499', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  Copy email address
                                </span>
                                <span style={{ fontSize: '0.98rem', fontWeight: 'bold', color: '#ffffff', wordBreak: 'break-all' }}>
                                  elparanaensolitario@gmail.com
                                </span>
                              </div>
                              <div style={{
                                background: copiedStates['email'] ? '#2e7d32' : '#24302a',
                                color: copiedStates['email'] ? '#ffffff' : '#ff9d42',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                minWidth: '82px',
                                textAlign: 'center',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }}>
                                {copiedStates['email'] ? 'Copied! ✓' : 'Copy 📋'}
                              </div>
                            </div>

                            {/* Direct shortcuts to standard webmail services for full sandbox safety */}
                            <p style={{ fontSize: '0.82rem', color: '#ff9d42', margin: '14px 0 8px 0', fontWeight: 'bold', textAlign: 'center' }}>
                              Compose draft directly using your preferred webmail:
                            </p>
                            <div style={{ 
                              display: 'grid', 
                              gridTemplateColumns: 'repeat(3, 1fr)', 
                              gap: '6px',
                              marginBottom: '14px'
                            }}>
                              <a 
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=elparanaensolitario@gmail.com&su=${encodeURIComponent(asuntoEmail)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="webmail-btn"
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'rgba(230, 126, 34, 0.08)',
                                  color: '#ff9d42',
                                  border: '1px solid rgba(230, 126, 34, 0.25)',
                                  padding: '8px 4px',
                                  borderRadius: '8px',
                                  fontSize: '0.72rem',
                                  fontWeight: 'bold',
                                  textDecoration: 'none',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <span style={{ fontSize: '1rem', marginBottom: '2px' }}>🌐</span> Gmail Web
                              </a>
                              <a 
                                href={`https://outlook.live.com/default.aspx?rru=compose&to=elparanaensolitario@gmail.com&subject=${encodeURIComponent(asuntoEmail)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="webmail-btn"
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'rgba(230, 126, 34, 0.08)',
                                  color: '#ff9d42',
                                  border: '1px solid rgba(230, 126, 34, 0.25)',
                                  padding: '8px 4px',
                                  borderRadius: '8px',
                                  fontSize: '0.72rem',
                                  fontWeight: 'bold',
                                  textDecoration: 'none',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <span style={{ fontSize: '1rem', marginBottom: '2px' }}>✉️</span> Outlook
                              </a>
                              <a 
                                href={`https://compose.mail.yahoo.com/?to=elparanaensolitario@gmail.com&subj=${encodeURIComponent(asuntoEmail)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="webmail-btn"
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'rgba(230, 126, 34, 0.08)',
                                  color: '#ff9d42',
                                  border: '1px solid rgba(230, 126, 34, 0.25)',
                                  padding: '8px 4px',
                                  borderRadius: '8px',
                                  fontSize: '0.72rem',
                                  fontWeight: 'bold',
                                  textDecoration: 'none',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <span style={{ fontSize: '1rem', marginBottom: '2px' }}>💜</span> Yahoo
                              </a>
                            </div>

                            <div className="aclaracion-manual" style={{ textAlign: 'left', lineHeight: '1.5' }}>
                              Thank you for being part of this journey! Since I handle each delivery personally, I ask for your patience. To send you your link as quickly as possible, please do the following when writing to me:
                              <ol style={{ paddingLeft: '22px', marginTop: '10px', listStyleType: 'decimal', fontStyle: 'normal' }}>
                                <li style={{ marginBottom: '6px' }}>In the email subject, write: <strong style={{ color: '#E67E22' }}>"Book [{getNombreLibro(selectedBook)}]"</strong>.</li>
                                <li style={{ marginBottom: '6px' }}>Attach your proof of payment/transfer.</li>
                                <li style={{ marginBottom: '6px' }}>Enjoy your reading!</li>
                              </ol>
                            </div>

                            {/* Botón de volver/cerrar exclusivo bajo la pestaña/contenedor de pago */}
                            <button
                              id="btn-volver-pago-en"
                              className="btn-volver"
                              onClick={cerrarPago}
                              style={{
                                width: '100%',
                                marginTop: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                background: '#1c2622',
                                color: '#eae3d5',
                                border: '1px solid #2a3831',
                                padding: '12px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                transition: '0.2s'
                              }}
                            >
                              ← {t.btnVolver}
                            </button>
                        </div>
                    </div>
                  )}
              </div>
          </div>
        </div>
      )}

      {/* MODAL DE REGALO */}
      {activeModal === 'regalo' && (
        <div id="modalRegalo" className="modal" style={{ display: 'flex' }}>
          <div className="modal-content modal-regalo" id="modal-regalo-content">
              {/* Fondo semi-transparente con la tapa del libro de regalo */}
              <div 
                className="modal-cover-bg" 
                style={{ 
                  backgroundImage: `url(${img3Src})`,
                  opacity: 0.70
                }} 
              />
              <div style={{ position: 'relative', zIndex: 10 }}>
                  <i className="fa-solid fa-gift" style={{ fontSize: '3.5rem', marginBottom: '15px' }}></i>
                  <h2 id="regalo-titulo" style={{ fontSize: '1.8rem' }}>{t.regaloT}</h2>
                  <p id="regalo-texto" style={{ margin: '20px 0', lineHeight: 1.6 }}>{t.regaloP}</p>
                  <button id="regalo-btn" className="btn-regalo" onClick={irAlCombo}>
                    {t.regaloB}
                  </button>
                  <p
                    style={{ marginTop: '15px', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={cerrarRegalo}
                    id="btn-close-regalo"
                  >
                    Cerrar / Close
                  </p>
              </div>
          </div>
        </div>
      )}

      {/* PANEL DE CONTROL DE PORTADAS DE GUSTAVO */}
      {showAdmin && (
        <div style={{
          marginTop: '50px',
          padding: '28px',
          backgroundColor: '#111614',
          borderRadius: '16px',
          border: '1.5px solid #2a3831',
          color: '#eae3d5',
          fontSize: '0.95rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
          textAlign: 'left',
          width: '100%',
          maxWidth: '1000px',
          margin: '50px auto 0 auto'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#ff9d42', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
            <span>⚙️</span> {lang === 'es' ? 'Panel de Autogestión de Portadas' : 'Covers Management Panel'}
          </h3>
          <p style={{ margin: '0 0 25px 0', fontSize: '0.88rem', color: '#8da499', lineHeight: '1.6' }}>
            {lang === 'es' 
              ? 'Hola Gustavo, este panel es exclusivo para que cargues tus portadas desde tu computadora. Al subirlas, se guardarán tanto en tu navegador actual como de forma física y permanente en el servidor, garantizando que tu sobrina y cualquier persona en el mundo las vean correctamente.'
              : 'Hi Gustavo, this panel is exclusive for you to upload your covers. By uploading them, they will be saved both in your current browser and permanently on the server, ensuring your niece and anyone else in the world sees them correctly.'}
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '25px'
          }}>
            {/* El Parana ES */}
            <div style={{ background: '#1c2622', padding: '16px', borderRadius: '12px', border: '1px solid #2a3831' }}>
              <span style={{ fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '10px', color: '#ff9d42' }}>
                📙 El Paraná en Solitario (Español)
              </span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => e.target.files?.[0] && handleImageUpload('parana_es', e.target.files[0])}
                style={{ fontSize: '0.8rem', width: '100%', color: '#8da499' }}
              />
              {covers.parana_es && <div style={{ color: '#2e7d32', fontSize: '0.75rem', marginTop: '5px' }}>✓ Cargada localmente</div>}
              {serverCovers.parana_es && <div style={{ color: '#ff9d42', fontSize: '0.75rem', marginTop: '2px' }}>✓ Sincronizada con el Servidor</div>}
            </div>

            {/* El Parana EN */}
            <div style={{ background: '#1c2622', padding: '16px', borderRadius: '12px', border: '1px solid #2a3831' }}>
              <span style={{ fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '10px', color: '#ff9d42' }}>
                📘 The Paraná in Solitude (Inglés)
              </span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => e.target.files?.[0] && handleImageUpload('parana_en', e.target.files[0])}
                style={{ fontSize: '0.8rem', width: '100%', color: '#8da499' }}
              />
              {covers.parana_en && <div style={{ color: '#2e7d32', fontSize: '0.75rem', marginTop: '5px' }}>✓ Cargada localmente</div>}
              {serverCovers.parana_en && <div style={{ color: '#ff9d42', fontSize: '0.75rem', marginTop: '2px' }}>✓ Sincronizada con el Servidor</div>}
            </div>

            {/* El Mandarina, Iara y Gus */}
            <div style={{ background: '#1c2622', padding: '16px', borderRadius: '12px', border: '1px solid #2a3831' }}>
              <span style={{ fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '10px', color: '#ff9d42' }}>
                🟢 El Mandarina, Iara y Gus (Fábula)
              </span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => e.target.files?.[0] && handleImageUpload('iara', e.target.files[0])}
                style={{ fontSize: '0.8rem', width: '100%', color: '#8da499' }}
              />
              {covers.iara && <div style={{ color: '#2e7d32', fontSize: '0.75rem', marginTop: '5px' }}>✓ Cargada localmente</div>}
              {serverCovers.iara && <div style={{ color: '#ff9d42', fontSize: '0.75rem', marginTop: '2px' }}>✓ Sincronizada con el Servidor</div>}
            </div>

            {/* Ingenieria ES */}
            <div style={{ background: '#1c2622', padding: '16px', borderRadius: '12px', border: '1px solid #2a3831' }}>
              <span style={{ fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '10px', color: '#ff9d42' }}>
                📙 Ingeniería Inversa (Español)
              </span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => e.target.files?.[0] && handleImageUpload('ingenieria_es', e.target.files[0])}
                style={{ fontSize: '0.8rem', width: '100%', color: '#8da499' }}
              />
              {covers.ingenieria_es && <div style={{ color: '#2e7d32', fontSize: '0.75rem', marginTop: '5px' }}>✓ Cargada localmente</div>}
              {serverCovers.ingenieria_es && <div style={{ color: '#ff9d42', fontSize: '0.75rem', marginTop: '2px' }}>✓ Sincronizada con el Servidor</div>}
            </div>

            {/* Ingenieria EN */}
            <div style={{ background: '#1c2622', padding: '16px', borderRadius: '12px', border: '1px solid #2a3831' }}>
              <span style={{ fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '10px', color: '#ff9d42' }}>
                📘 Reverse Engineering (Inglés)
              </span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => e.target.files?.[0] && handleImageUpload('ingenieria_en', e.target.files[0])}
                style={{ fontSize: '0.8rem', width: '100%', color: '#8da499' }}
              />
              {covers.ingenieria_en && <div style={{ color: '#2e7d32', fontSize: '0.75rem', marginTop: '5px' }}>✓ Cargada localmente</div>}
              {serverCovers.ingenieria_en && <div style={{ color: '#ff9d42', fontSize: '0.75rem', marginTop: '2px' }}>✓ Sincronizada con el Servidor</div>}
            </div>

            {/* Trilogia ES */}
            <div style={{ background: '#1c2622', padding: '16px', borderRadius: '12px', border: '1px solid #2a3831' }}>
              <span style={{ fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '10px', color: '#ff9d42' }}>
                📙 Combo Trilogía (Español)
              </span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => e.target.files?.[0] && handleImageUpload('trilogia_es', e.target.files[0])}
                style={{ fontSize: '0.8rem', width: '100%', color: '#8da499' }}
              />
              {covers.trilogia_es && <div style={{ color: '#2e7d32', fontSize: '0.75rem', marginTop: '5px' }}>✓ Cargada localmente</div>}
              {serverCovers.trilogia_es && <div style={{ color: '#ff9d42', fontSize: '0.75rem', marginTop: '2px' }}>✓ Sincronizada con el Servidor</div>}
            </div>

            {/* Trilogia EN */}
            <div style={{ background: '#1c2622', padding: '16px', borderRadius: '12px', border: '1px solid #2a3831' }}>
              <span style={{ fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '10px', color: '#ff9d42' }}>
                📘 Combo Trilogy (Inglés)
              </span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => e.target.files?.[0] && handleImageUpload('trilogia_en', e.target.files[0])}
                style={{ fontSize: '0.8rem', width: '100%', color: '#8da499' }}
              />
              {covers.trilogia_en && <div style={{ color: '#2e7d32', fontSize: '0.75rem', marginTop: '5px' }}>✓ Cargada localmente</div>}
              {serverCovers.trilogia_en && <div style={{ color: '#ff9d42', fontSize: '0.75rem', marginTop: '2px' }}>✓ Sincronizada con el Servidor</div>}
            </div>
          </div>

          <button 
            onClick={() => {
              if (confirm(lang === 'es' ? '¿Estás seguro de que quieres restablecer todas las portadas a sus valores de fábrica en tu navegador?' : 'Are you sure you want to reset all covers in your browser?')) {
                localStorage.removeItem('cover_parana_es');
                localStorage.removeItem('cover_parana_en');
                localStorage.removeItem('cover_iara');
                localStorage.removeItem('cover_ingenieria_es');
                localStorage.removeItem('cover_ingenieria_en');
                localStorage.removeItem('cover_trilogia_es');
                localStorage.removeItem('cover_trilogia_en');
                setCovers({
                  parana_es: '',
                  parana_en: '',
                  iara: '',
                  ingenieria_es: '',
                  ingenieria_en: '',
                  trilogia_es: '',
                  trilogia_en: '',
                });
              }
            }}
            style={{
              background: 'transparent',
              color: '#e74c3c',
              border: '1px solid #e74c3c',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e74c3c'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#e74c3c'; }}
          >
            {lang === 'es' ? 'Restablecer Portadas en mi Navegador' : 'Reset My Browser Covers'}
          </button>
        </div>
      )}

    </div>
  );
}
