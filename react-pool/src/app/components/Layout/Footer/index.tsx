import { useTranslation } from "react-i18next";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";

import * as React from "react";
import WidgetBot from "@widgetbot/react-embed";

export const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <Grid
            container
            mt={4}
            py={2}
            sx={{ borderTop: 1, borderColor: "divider" }}
            justifyContent="center"
            alignItems="center"
            spacing={1}
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

            <Grid
                container
                item
                xs={12}
                md="auto"
                direction="row"
                alignItems="center"
                justifyContent="center"
            >
                <Typography
                    component="a"
                    href="https://www.signum.network/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        src={`/assets/powered.svg`}
                        width={94}
                        height={32}
                        alt="Signum logo"
                    />
                </Typography>

                <Typography
                    component="a"
                    href="https://signum-network.gitbook.io/signumjs/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        src={`/assets/Signum_Badge_JS.svg`}
                        width={35}
                        height={35}
                        alt="SignumJS logo"
                    />
                </Typography>

                <Typography
                    component="a"
                    href="https://github.com/signum-network/signum-pool"
                    target="_blank"
                    rel="noreferrer"
                >
                    <GitHubIcon sx={{ fontSize: 34 }} />
                </Typography>
            </Grid>

            <Grid item xs={12} md="auto">
                <Typography variant="body2" align="center">
                    {t("footerLabel")} @ (2019-
                    {currentYear})
                </Typography>
            </Grid>
        </Grid>
    );
};
