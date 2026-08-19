import { useState, type FormEvent } from 'react';
import { config } from '../config';
import styles from './Contact.module.css';
import page from './Page.module.css';

/**
 * Pagina "Contatti": informazioni dirette + form di contatto.
 * Il form invia i messaggi via Web3Forms (nessun backend proprio):
 * imposta la access key in config.WEB3FORMS_ACCESS_KEY.
 */
type Status = 'idle' | 'sending' | 'success' | 'error';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const keyMissing = config.WEB3FORMS_ACCESS_KEY.trim() === '';

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (keyMissing) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('access_key', config.WEB3FORMS_ACCESS_KEY);
    formData.append('subject', 'Nuovo messaggio da RadioDJToto');
    formData.append('from_name', 'RadioDJToto');

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Invio non riuscito. Riprova.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Errore di rete. Controlla la connessione e riprova.');
    }
  }

  return (
    <>
      <header className={`container ${page.header}`}>
        <span className="eyebrow">Contatti</span>
        <h1>Scrivici, ti ascoltiamo</h1>
        <p className={page.lead}>
          Richieste musicali, dediche, collaborazioni o semplicemente due
          parole: siamo felici di sentirti.
        </p>
      </header>

      <section className={`container ${styles.layout}`}>
        {/* Info di contatto */}
        <aside className={styles.info}>
          <div className={styles.infoBlock}>
            <span className={styles.infoLabel}>Email</span>
            <a href={`mailto:${config.contact.email}`}>{config.contact.email}</a>
          </div>
          {/* <div className={styles.infoBlock}>
            <span className={styles.infoLabel}>Dove siamo</span>
            <span>{config.contact.city}</span>
          </div> */}
          <div className={styles.infoBlock}>
            <span className={styles.infoLabel}>Social</span>
            <div className={styles.social}>
              <a href={config.social.instagram} target="_blank" rel="noreferrer noopener">
                Instagram
              </a>
              <a href={config.social.facebook} target="_blank" rel="noreferrer noopener">
                Facebook
              </a>
              <a href={config.social.youtube} target="_blank" rel="noreferrer noopener">
                YouTube
              </a>
              <a href={config.social.tiktok} target="_blank" rel="noreferrer noopener">
                TikTok
              </a>
            </div>
          </div>
        </aside>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {status === 'success' ? (
            <div className={styles.success} role="status">
              <h3>Grazie di cuore! 🎶</h3>
              <p>
                Abbiamo ricevuto il tuo messaggio. Ti risponderemo il prima
                possibile.
              </p>
            </div>
          ) : (
            <>
              {/* Honeypot anti-spam (nascosto agli utenti reali) */}
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                style={{ display: 'none' }}
                aria-hidden="true"
              />

              <div className={styles.field}>
                <label htmlFor="name">Nome</label>
                <input id="name" name="name" type="text" required autoComplete="name" />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className={styles.field}>
                <label htmlFor="message">Messaggio</label>
                <textarea id="message" name="message" rows={5} required />
              </div>

              {status === 'error' && (
                <p className={styles.formError} role="alert">
                  {errorMsg}
                </p>
              )}
              {keyMissing && (
                <p className={styles.formNote}>
                  Il form non è ancora attivo: manca la access key di Web3Forms
                  in <code>src/config.ts</code>.
                </p>
              )}

              <button
                type="submit"
                className={styles.submit}
                disabled={status === 'sending' || keyMissing}
              >
                {status === 'sending' ? 'Invio in corso…' : 'Invia messaggio'}
              </button>
            </>
          )}
        </form>
      </section>
    </>
  );
}
