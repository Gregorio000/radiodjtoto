import { useState } from 'react';
import styles from './Schedule.module.css';
import page from './Page.module.css';

/* Programma settimanale (dati statici di esempio, facilmente modificabili). */

interface Program {
  time: string;
  title: string;
  host: string;
  desc: string;
}

const weekdayPrograms: Program[] = [
  { time: '07:00', title: 'Buongiorno Napoli', host: 'Toto', desc: 'Sveglia in musica con i classici e le notizie del mattino.' },
  { time: '10:00', title: 'Melodie senza tempo', host: 'Assunta', desc: 'Le grandi arie della tradizione partenopea.' },
  { time: '13:00', title: "L'ora d'o cafè", host: 'Gennaro', desc: 'Chiacchiere, dediche e richieste degli ascoltatori.' },
  { time: '16:00', title: 'Nuove voci', host: 'Carmela', desc: 'Gli artisti emergenti della nuova canzone napoletana.' },
  { time: '19:00', title: 'Napoli by night', host: 'Salvatore', desc: 'La colonna sonora della sera, tra classico e moderno.' },
  { time: '22:00', title: 'Notte partenopea', host: 'Non-stop', desc: 'Musica in continuo fino al mattino.' },
];

const weekendPrograms: Program[] = [
  { time: '09:00', title: 'Domenica in melodia', host: 'Assunta', desc: 'Il risveglio dolce del fine settimana.' },
  { time: '12:00', title: 'La tavola napoletana', host: 'Gennaro', desc: 'Musica e tradizioni attorno al pranzo della domenica.' },
  { time: '15:00', title: 'Grandi classici', host: 'Toto', desc: 'Un viaggio tra i capolavori immortali.' },
  { time: '18:00', title: 'Festa in piazza', host: 'Carmela', desc: 'Ritmo e allegria per la sera del weekend.' },
  { time: '21:00', title: 'Serenata', host: 'Salvatore', desc: "Le canzoni d'amore che hanno fatto la storia." },
];

type Tab = 'settimana' | 'weekend';

/** Pagina "Palinsesto / Programmi". */
export function Schedule() {
  const [tab, setTab] = useState<Tab>('settimana');
  const programs = tab === 'settimana' ? weekdayPrograms : weekendPrograms;

  return (
    <>
      <header className={`container ${page.header}`}>
        <span className="eyebrow">Palinsesto</span>
        <h1>I nostri programmi</h1>
        <p className={page.lead}>
          Ogni giorno una scaletta pensata per accompagnarti dalla mattina alla
          notte. Gli orari possono variare per eventi speciali.
        </p>
      </header>

      <section className={`container ${styles.section}`}>
        <div className={styles.tabs} role="tablist" aria-label="Giorni della settimana">
          <button
            role="tab"
            aria-selected={tab === 'settimana'}
            className={`${styles.tab} ${tab === 'settimana' ? styles.tabActive : ''}`}
            onClick={() => setTab('settimana')}
          >
            Lun–Ven
          </button>
          <button
            role="tab"
            aria-selected={tab === 'weekend'}
            className={`${styles.tab} ${tab === 'weekend' ? styles.tabActive : ''}`}
            onClick={() => setTab('weekend')}
          >
            Sab–Dom
          </button>
        </div>

        <ol className={styles.list}>
          {programs.map((p) => (
            <li key={p.time} className={styles.row}>
              <span className={styles.time}>{p.time}</span>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.details}>
                <span className={styles.progTitle}>{p.title}</span>
                <span className={styles.host}>con {p.host}</span>
                <span className={styles.desc}>{p.desc}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
