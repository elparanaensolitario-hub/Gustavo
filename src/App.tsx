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

  // Las portadas maestras fijas que importamos directamente desde el código
  const img1Src = lang === 'es' ? paranaEs : paranaEn;
  const img2Src = iaraCover;
  const img3Src = lang === 'es' ? ingenieriaEs : ingenieriaEn;
  const img4Src = lang === 'es' ? trilogiaEs : trilogiaEn;

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

    </div>
  );
}
