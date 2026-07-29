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

const HomePage = () => {
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
          Typesense Search & AI Retrieval
        </Typography>
        <Typography variant="epsilon" textColor="neutral600">
          Unified Full-Text, Vector, and Hybrid Search for Strapi 5
        </Typography>
      </Box>

      <Box paddingBottom={6}>
        <Card>
          <CardHeader padding={4}>
            <Typography variant="delta" fontWeight="bold">
              Typesense Server Connection
            </Typography>
          </CardHeader>
          <Divider />
          <CardBody padding={4}>
            <Flex gap={3} alignItems="center">
              <Typography variant="omega">Status:</Typography>
              {loading ? (
                <Badge active variant="neutral">Checking...</Badge>
              ) : health ? (
                <Badge active variant="success">
                  Connected & Healthy
                </Badge>
              ) : (
                <Badge active variant="danger">
                  Disconnected / Action Required
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
                Vector & Hybrid Search
              </Typography>
            </CardHeader>
            <Divider />
            <CardBody padding={4}>
              <Typography variant="omega">
                Typesense includes native vector search with auto-embeddings model support (`ts/all-MiniLM-L6-v2`).
              </Typography>
              <Box paddingTop={4}>
                <Button variant="secondary">Configure Vector Fields</Button>
              </Box>
            </CardBody>
          </Card>
        </Grid.Item>

        <Grid.Item col={1}>
          <Card>
            <CardHeader padding={4}>
              <Typography variant="delta" fontWeight="bold">
                Content-Type Indexing
              </Typography>
            </CardHeader>
            <Divider />
            <CardBody padding={4}>
              <Typography variant="omega">
                Automatic real-time synchronization on entry creation, update, and deletion lifecycles.
              </Typography>
              <Box paddingTop={4}>
                <Button variant="default">Re-index All Collections</Button>
              </Box>
            </CardBody>
          </Card>
        </Grid.Item>
      </Grid.Root>
    </Main>
  );
};

export { HomePage };