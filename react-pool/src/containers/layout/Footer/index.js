// React translations
import { useTranslation } from "react-i18next";

// Material ui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Styles
import styles from "./Footer.module.css";

import * as React from 'react'
import WidgetBot from '@widgetbot/react-embed'

const Footer = () => {
  // Translations details
  const { t } = useTranslation();

  return (
    <Grid
      direction="column"
      justifyContent="center"
      alignItems="center"
      container
      className={styles.footerContainer}
      component="footer"
    >

      <Grid item container justifyContent="center" alignItems="center">
        <Grid item container justifyContent="center" alignItems="center">
          <a href="https://discordapp.com/channels/969599083801104395/969600979974635600" target="blank">Discord</a>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center">
          <WidgetBot
             server="969599083801104395"
             channel="969600979974635600"
             style={{
                opacity: "0.5",
                boxSizing: "border-box",
                height: "500px",
                width: "100%",
                maxWidth: "1000px",
                marginBottom: "25px",
             }}
          />
        </Grid>
      </Grid>

      <Grid item container justifyContent="center" alignItems="center">
        <Grid item container justifyContent="center" alignItems="center">
              <p><a href="https://hearthis.at/nivok-spilkommen/drop-zone/" target="blank">Music from Nivok</a></p>
        </Grid>
        <Grid item container justifyContent="center" alignItems="center">
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
                  width: "100%",
                  maxWidth: "1000px",
                  marginBottom: "25px",
                 }}
              ></iframe>
        </Grid>
      </Grid>

      <Grid
        item
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
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
