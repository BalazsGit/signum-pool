// React translations
import { useTranslation } from "react-i18next";

// Material ui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Styles
import styles from "./Footer.module.css";

const Footer = () => {
  // Translations details
  const { t } = useTranslation();

  return (
    <Grid
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      container
      className={styles.footerContainer}
      component="footer"
    >
     <Grid item container justify="center" alignItems="center">
        <p><a href="https://hearthis.at/nivok-spilkommen/drop-zone/" target="blank">Music from Nivok</a></p>
     </Grid>
     <Grid item container justify="center" alignItems="center">
        <iframe
          scrolling="no"
          allowtransparency="true"
          frameBorder="0"
          title="Mini widget"
          src="https://app.hearthis.at/nivok-spilkommen/embed/?hcolor=303030"
          style={{
            opacity: "0.5",
            boxSizing: "border-box",
            height: "250px",
            width: "50%",
           }}
        ></iframe>
      </Grid>
      <Grid container direction="row" justify="center" alignItems="center">
        <Typography variant="body2" align="center">
          <a
            href="https://github.com/signum-network/signum-pool"
            target="_blank"
            rel="noreferrer"
          >
            <u>Github repo</u>
          </a>{" "}
          - {t("footerLabel")} @ (2019-
          {new Date().getFullYear()})
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;
