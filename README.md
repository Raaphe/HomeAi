

### Contributors

<!-- readme: contributors -start --> 
<table>
<tr>
    <td align="center">
        <a href="https://github.com/Raaphe">
            <img src="https://avatars.githubusercontent.com/u/120033739?v=4" width="100;" alt="Raaphe"/>
            <br />
            <sub><b>Raph</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/hasilon88">
            <img src="https://avatars.githubusercontent.com/u/109122423?v=4" width="100;" alt="hasilon88"/>
            <br />
            <sub><b>Harjot Singh</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/Schn777">
            <img src="https://avatars.githubusercontent.com/u/120033739?v=4" width="100;" alt="Schn777"/>
            <br />
            <sub><b>Schn777</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/TommySpag">
            <img src="https://avatars.githubusercontent.com/u/112038592?v=4" width="100;" alt="TommySpag"/>
            <br />
            <sub><b>TommySpag</b></sub>
        </a>
    </td>
</tr>
</table>
<!-- readme: contributors -end -->

**Needed commands**
- npm i -g yarn
- yarn install
- yarn start

**Components**
This is where your reusable components live which help you build your screens.

**i18n**
This is where your translations will live if you are using `react-native-i18n`.

**Models**
This is where your app's models will live. Each model has a directory which will contain the `mobx-state-tree` model file, test file, and any other supporting files like actions, types, etc.

**Navigators**
This is where your `react-navigation` navigators will live.

**Screens**
This is where your screen components will live. A screen is a React component which will take up the entire screen and be part of the navigation hierarchy. Each screen will have a directory containing the `.tsx` file, along with any assets or other helper files.

**Services**
Any services that interface with the outside world will live here (think REST APIs, Push Notifications, etc.).

**Theme**
Here lives the theme for your application, including spacing, colors, and typography.

**Utils**
This is a great place to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truly shared across your application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.

**app.tsx** This is the entry point to your app. This is where you will find the main App component which renders the rest of the application.

### ./assets directory

This directory is designed to organize and store various assets, making it easy for you to manage and use them in your application. The assets are further categorized into subdirectories, including `icons` and `images`:

```
assets
├── icons
└── images
```

**Icons**
This is where your icon assets will live. These icons can be used for buttons, navigation elements, or any other UI components. The recommended format for icons is PNG, but other formats can be used as well.

Ignite comes with a built-in `Icon` component. You can find detailed usage instructions in the [docs](https://github.com/infinitered/ignite/blob/master/docs/Components-Icon.md).

**Images**
This is where your images will live, such as background images, logos, or any other graphics. You can use various formats such as PNG, JPEG, or GIF for your images.

Another valuable built-in component within Ignite is the `AutoImage` component. You can find detailed usage instructions in the [docs](https://github.com/infinitered/ignite/blob/master/docs/Components-AutoImage.md).

How to use your `icon` or `image` assets:

```
import { Image } from 'react-native';

const MyComponent = () => {
  return (
    <Image source={require('../assets/images/my_image.png')} />
  );
};
```

### ./ignite directory

The `ignite` directory stores all things Ignite, including CLI and boilerplate items. Here you will find templates you can customize to help you get started with React Native.

### ./test directory

This directory will hold your Jest configs and mocks.

## Running Maestro end-to-end tests

Follow our [Maestro Setup](https://ignitecookbook.com/docs/recipes/MaestroSetup) recipe from the [Ignite Cookbook](https://ignitecookbook.com/)!

## Previous Boilerplates

- [2018 aka Bowser](https://github.com/infinitered/ignite-bowser)
- [2017 aka Andross](https://github.com/infinitered/ignite-andross)
- [2016 aka Ignite 1.0](https://github.com/infinitered/ignite-ir-boilerplate-2016)
