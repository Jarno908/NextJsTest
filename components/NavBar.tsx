import React, {useState} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from 'next-auth/react';
import { createStyles, Header, Container, Group, Burger, Paper, Transition, ActionIcon, useMantineColorScheme, ThemeIcon } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },
}));

const NavBar: React.FC = () => {
  const router = useRouter();
  const [opened, toggleOpened] = useBooleanToggle(false);
  const [active, setActive] = useState(router.pathname);
  const { classes, cx } = useStyles();

  const { data: session, status } = useSession();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const navItems = [
    createLink("/", "Feed"),
  ];

  if(session)
  {
    navItems.push(
      createLink("/drafts", "My drafts"),
      createLink("/create", "New Post"),
    )
  }

  function createLink(link: string, label: string): JSX.Element {
    return (
      <Link
        key={label}
        href={link} 
        passHref
      >
        <a
          className={cx(classes.link, { [classes.linkActive]: active === link })}
          onClick={(event) => {
            setActive(link);
            toggleOpened(false);
          }}
        >
          {label}
        </a>
      </Link>
    )
  }

  function createUserSection() : JSX.Element {
    if(session) {
      return(
        <Group>
          <p>
            {session.user.name} ({session.user.email})
          </p>
          {createLink("/auth/signout", "Log out")}
        </Group>
      )
    } else if(status === "loading") {
      return(
        <Group>
          <p>Validating session ...</p>
        </Group>
      )
    } else {
      return(
        <Group>
          {createLink("/api/auth/signin", "Log in")}
        </Group>
      )
    }
  }

  return (
    <Header height={HEADER_HEIGHT} mb={120} className={classes.root}>
      <Container className={classes.header} fluid={true} >
        <div>
          <Group spacing={5} className={classes.links}>
            {navItems}
          </Group>

          <Burger
            opened={opened}
            onClick={() => toggleOpened()}
            className={classes.burger}
            size="sm"
          />

          <Transition transition="pop-top-right" duration={200} mounted={opened}>
            {(styles) => (
              <Paper className={classes.dropdown} withBorder style={styles}>
                {navItems}
              </Paper>
            )}
          </Transition>
        </div>
        <Group>
          <ActionIcon
            variant="outline"
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
            size={26}
          >
            {dark ? <MdOutlineLightMode size="20px" /> : <MdOutlineDarkMode size="20px" />}
          </ActionIcon>
          
          {createUserSection()}
        </Group>
      </Container>
    </Header>
  );
}

export default NavBar;