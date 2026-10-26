import React, { useEffect, useState } from "react";
import {
  Main,
  Box,
  Flex,
  Typography,
  Button,
  Badge,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Divider,
} from "@strapi/design-system";
import { useIntl } from "react-intl";

import { getTranslation } from "../utils/getTranslation";

const HomePage = () => {
  const { formatMessage } = useIntl();
  const t = (id: string, defaultMessage: string) =>
    formatMessage({ id: getTranslation(id), defaultMessage });
  const [health, setHealth] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/typesense/health")
      .then((res) => res.json())
      .then((data) => {
        setHealth(data.healthy);
        setLoading(false);
      })
      .catch(() => {
        setHealth(false);
        setLoading(false);
      });
  }, []);

  return (
    <Main padding={8}>
      <Box paddingBottom={6}>
        <Typography variant="alpha">
          {t("home.title", "Typesense Search & AI Retrieval")}
        </Typography>
        <Typography variant="epsilon" textColor="neutral600">
          {t("home.subtitle", "Unified Full-Text, Vector, and Hybrid Search for Strapi 5")}
        </Typography>
      </Box>

      <Box paddingBottom={6}>
        <Card>
          <CardHeader padding={4}>
            <Typography variant="delta" fontWeight="bold">
              {t("connection.title", "Typesense Server Connection")}
            </Typography>
          </CardHeader>
          <Divider />
          <CardBody padding={4}>
            <Flex gap={3} alignItems="center">
              <Typography variant="omega">{t("connection.status", "Status:")}</Typography>
              {loading ? (
                <Badge active variant="neutral">{t("connection.checking", "Checking...")}</Badge>
              ) : health ? (
                <Badge active variant="success">
                  {t("connection.healthy", "Connected & Healthy")}
                </Badge>
              ) : (
                <Badge active variant="danger">
                  {t("connection.unhealthy", "Disconnected / Action Required")}
                </Badge>
              )}
            </Flex>
          </CardBody>
        </Card>
      </Box>

      <Grid.Root gap={6} gridCols={2}>
        <Grid.Item col={1}>
          <Card>
            <CardHeader padding={4}>
              <Typography variant="delta" fontWeight="bold">
                {t("vector.title", "Vector & Hybrid Search")}
              </Typography>
            </CardHeader>
            <Divider />
            <CardBody padding={4}>
              <Typography variant="omega">
                {t("vector.description", "Typesense includes native vector search with auto-embeddings model support (ts/all-MiniLM-L6-v2).")}
              </Typography>
              <Box paddingTop={4}>
                <Button variant="secondary">{t("vector.configure", "Configure Vector Fields")}</Button>
              </Box>
            </CardBody>
          </Card>
        </Grid.Item>

        <Grid.Item col={1}>
          <Card>
            <CardHeader padding={4}>
              <Typography variant="delta" fontWeight="bold">
                {t("indexing.title", "Content-Type Indexing")}
              </Typography>
            </CardHeader>
            <Divider />
            <CardBody padding={4}>
              <Typography variant="omega">
                {t("indexing.description", "Automatic real-time synchronization on entry creation, update, and deletion lifecycles.")}
              </Typography>
              <Box paddingTop={4}>
                <Button variant="default">{t("indexing.reindex", "Re-index All Collections")}</Button>
              </Box>
            </CardBody>
          </Card>
        </Grid.Item>
      </Grid.Root>
    </Main>
  );
};

export { HomePage };