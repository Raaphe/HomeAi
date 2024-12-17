// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    "standard",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-native/all",
    // `expo` must come after `standard` or its globals configuration will be overridden
    "expo",
    // `jsx-runtime` must come after `expo` or it will be overridden
    "plugin:react/jsx-runtime",
    "prettier",
  ],
  plugins: ["reactotron", "prettier"],
  rules: {
    "prettier/prettier": "off", // Désactive les erreurs Prettier
    // typescript-eslint
    "@typescript-eslint/array-type": 0, // Accepte tout type d'array
    "@typescript-eslint/ban-ts-comment": 0, // Accepte les commentaires de type `@ts-ignore`
    "@typescript-eslint/no-explicit-any": 0, // Accepte `any`
    "@typescript-eslint/no-unused-vars": [
      "off", // Ignore les variables inutilisées
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-var-requires": 0, // Accepte `require`
    "@typescript-eslint/no-require-imports": 0, // Accepte les importations `require`
    "@typescript-eslint/no-empty-object-type": 0, // Accepte les types d'objets vides
    // eslint
    "no-use-before-define": 0, // Accepte les variables ou fonctions définies après leur utilisation
    "no-restricted-imports": 0, // Ne restreint pas les imports
    // react
    "react/prop-types": 0, // Accepte les props non typées
    // react-native
    "react-native/no-raw-text": 0, // Accepte le texte brut dans React Native
    // reactotron
    "reactotron/no-tron-in-production": "off", // Désactive l'erreur pour Reactotron en production
    // eslint-config-standard overrides
    "comma-dangle": 0, // Accepte ou ignore les virgules de fin
    "no-global-assign": 0, // Accepte les assignments globaux
    "quotes": 0, // Accepte les guillemets simples ou doubles
    "space-before-function-paren": 0, // Accepte l'absence ou la présence d'espaces avant les parenthèses de fonction
  },
}
