# CMS backups

The `cms-backup.yml` workflow exports the configured Sanity dataset daily in
two formats and stores both files as a GitHub Actions artifact for 30 days:

- A portable JSON file for importing into any backend.
- A Sanity `tar.gz` archive for restoring or moving between Sanity datasets.

The JSON has a stable top-level shape with `format`, `version`, `exportedAt`,
`source`, and `documents`. Each document contains `id`, `type`, timestamps, and
a `data` object. Sanity's internal system records and revision fields are
excluded, and nested `_type`, `_key`, `_ref`, and slug values are converted to
portable `type`, `id`, `referenceId`, and strings. Asset binaries are not
embedded in the JSON.

Configure these repository settings before enabling the workflow:

- **Variable** `SANITY_PROJECT_ID`: the Sanity project ID.
- **Variable** `SANITY_DATASET`: usually `production`.
- **Secret** `SANITY_AUTH_TOKEN`: a Sanity token for unattended CI usage.

The workflow can also be started manually from the **Actions** tab.
