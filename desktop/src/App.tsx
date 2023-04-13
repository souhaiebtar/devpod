import {
  Box,
  BoxProps,
  Code,
  Container,
  Flex,
  Grid,
  GridItem,
  GridProps,
  Link,
  Text,
  useColorModeValue,
  useToken,
  VStack,
} from "@chakra-ui/react"
import { useEffect, useMemo } from "react"
import { Link as RouterLink, Outlet, useMatch, useNavigate, useRouteError } from "react-router-dom"
import { Sidebar, SidebarMenuItem, StatusBar, Toolbar } from "./components"
import { ToolbarProvider, useChangeSettings, useSettings } from "./contexts"
import { Briefcase, Cog, Stack3D } from "./icons"
import { Routes } from "./routes"
import { useBorderColor } from "./Theme"
import { useAppReady } from "./useAppReady"

const TITLE_BAR_SAFE_AREA: BoxProps["height"] = "10"
const STATUS_BAR_SAFE_AREA: BoxProps["height"] = "5"
const TOOLBAR_HEIGHT: BoxProps["height"] = "32"
const SIDEBAR_WIDTH: BoxProps["width"] = "15rem"

export function App() {
  useAppReady()
  const navigate = useNavigate()
  const rootRouteMatch = useMatch(Routes.ROOT)
  const { sidebarPosition } = useSettings()
  const contentBackgroundColor = useColorModeValue("white", "black")
  const toolbarHeight = useToken("sizes", TOOLBAR_HEIGHT as string)
  const borderColor = useBorderColor()

  const mainGridProps = useMemo<GridProps>(() => {
    if (sidebarPosition === "right") {
      return { templateAreas: `"main sidebar"`, gridTemplateColumns: `1fr ${SIDEBAR_WIDTH}` }
    }

    return { templateAreas: `"sidebar main"`, gridTemplateColumns: `${SIDEBAR_WIDTH} 1fr` }
  }, [sidebarPosition])

  useEffect(() => {
    if (rootRouteMatch !== null) {
      navigate(Routes.WORKSPACES)
    }
  }, [navigate, rootRouteMatch])

  usePartyParrot()

  return (
    <Flex height="100vh" width="100vw" maxWidth="100vw" overflow="hidden">
      <Box
        data-tauri-drag-region // keep!
        height={TITLE_BAR_SAFE_AREA}
        position="fixed"
        top="0"
        width="full"
        textAlign={"center"}
        zIndex={2}>
        <Text
          data-tauri-drag-region // keep!
          fontWeight="bold"
          marginTop="2">
          Devpod Desktop
        </Text>
      </Box>
      <Box width="full" height="full">
        <Grid height="full" {...mainGridProps}>
          <GridItem area="sidebar">
            <Sidebar paddingTop={TITLE_BAR_SAFE_AREA}>
              <SidebarMenuItem to={Routes.WORKSPACES} icon={<Briefcase />}>
                Workspaces
              </SidebarMenuItem>
              <SidebarMenuItem to={Routes.PROVIDERS} icon={<Stack3D />}>
                Providers
              </SidebarMenuItem>
              <SidebarMenuItem to={Routes.SETTINGS} icon={<Cog />}>
                Settings
              </SidebarMenuItem>
            </Sidebar>
          </GridItem>

          <GridItem area="main" height="100vh" width="full" overflowX="auto">
            <ToolbarProvider>
              <Box
                data-tauri-drag-region // keep!
                backgroundColor={contentBackgroundColor}
                position="relative"
                width="full"
                height="full"
                overflowY="auto">
                <Toolbar
                  paddingTop={TITLE_BAR_SAFE_AREA}
                  backgroundColor={contentBackgroundColor}
                  height={TOOLBAR_HEIGHT}
                  position="sticky"
                  zIndex={1}
                  width="full"
                />
                <Box
                  as="main"
                  paddingTop="8"
                  paddingBottom={STATUS_BAR_SAFE_AREA}
                  paddingX="8"
                  width="full"
                  height={`calc(100vh - ${toolbarHeight})`}
                  overflowY="auto">
                  <Outlet />
                </Box>
                <StatusBar
                  position="fixed"
                  bottom="0"
                  width={`calc(100% - ${SIDEBAR_WIDTH})`}
                  borderTopWidth="thin"
                  borderTopColor={borderColor}
                  backgroundColor={contentBackgroundColor}
                />
              </Box>
            </ToolbarProvider>
          </GridItem>
        </Grid>
      </Box>
    </Flex>
  )
}

export function ErrorPage() {
  const error = useRouteError()
  const contentBackgroundColor = useColorModeValue("white", "black")

  return (
    <Box height="100vh" width="100vw" backgroundColor={contentBackgroundColor}>
      <Container padding="16">
        <VStack>
          <Text>Whoops, something went wrong or this page doesn&apos;t exist.</Text>
          <Box paddingBottom="6">
            <Link as={RouterLink} to={Routes.ROOT}>
              Go back to home
            </Link>
          </Box>
          <Code>{JSON.stringify(error, null, 2)}</Code>{" "}
        </VStack>
      </Container>
    </Box>
  )
}

function usePartyParrot() {
  const { set: setSettings, settings } = useChangeSettings()

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.shiftKey && event.ctrlKey && event.key.toLowerCase() === "p") {
        const current = settings.partyParrot
        setSettings("partyParrot", !current)
      }
    }
    document.addEventListener("keyup", handler)

    return () => document.addEventListener("keyup", handler)
  }, [setSettings, settings.partyParrot])
}
