import styles from './Page.module.css';
import about from './About.module.css';

/** Pagina "Chi siamo". */
export function About() {
  return (
    <>
      <header className={`container ${styles.header}`}>
        <span className="eyebrow">Chi siamo</span>
        <h1>Una radio nata dall'amore per Napoli</h1>
        <p className={styles.lead}>
          RadioDJToto custodisce e rilancia la canzone napoletana: dalle arie
          senza tempo alle nuove interpretazioni, con la cura di chi conosce e
          rispetta questa tradizione.
        </p>
      </header>

      <section className={`container ${styles.section}`}>
        <div className={styles.cards}>
          <article className={styles.card}>
            <h3>La tradizione</h3>
            <p>
              Da Caruso a Murolo, da Carosone a Pino Daniele: un archivio vivo
              della melodia partenopea, selezionato con passione.
            </p>
          </article>
          <article className={styles.card}>
            <h3>Le nuove voci</h3>
            <p>
              Diamo spazio agli artisti emergenti che portano avanti la lingua e
              il sentimento di Napoli con uno sguardo contemporaneo.
            </p>
          </article>
          <article className={styles.card}>
            <h3>Sempre in diretta</h3>
            <p>
              Musica, programmi e voci amiche 24 ore su 24, ovunque tu sia, dal
              telefono al computer.
            </p>
          </article>
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={about.storia}>
          <figure className={about.figure}>
            <img
              src="/toto.png"
              alt="Totò, simbolo di RadioDJToto"
              className={about.portrait}
            />
            <figcaption className={about.caption}>
              Il volto della nostra radio
            </figcaption>
          </figure>

          <div className={about.storyText}>
            <h2>La nostra storia</h2>
            <p>
              RadioDJToto nasce come progetto indipendente che voleva ridare centralità alla canzone
              napoletana. Quello che era un desiderio è diventato una radio a
              tutti gli effetti: una programmazione curata, uno streaming
              continuo e una comunità che cresce ogni giorno.
            </p>
            <p>
              Il nome è un omaggio all'ideatore di questa Radio, Salvatore (detto Totò). 
              L'obiettivo è semplice: far sentire Napoli, ovunque, con la
              qualità e l'eleganza che questa musica merita.
            </p>
          </div>
        </div>
      </section>

      <section className={`container ${styles.section}`}>
        <div className={styles.prose}>
          <h2>La nostra missione</h2>
          <p>
            Preservare il patrimonio, valorizzare il presente e accompagnare chi
            ascolta con un suono caldo e riconoscibile. Crediamo che una melodia
            napoletana possa unire generazioni diverse: è questo il filo che
            guida ogni nostra scelta musicale.
          </p>
        </div>
      </section>
    </>
  );
}
