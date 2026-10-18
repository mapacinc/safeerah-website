# Safeerah website

Static HTML, CSS and JavaScript site with no build step. Preview locally from this folder with `python -m http.server 8000`, then open `http://localhost:8000`.

## Launch state

This local checkout is a launch-preparation copy; no publication was performed for this task. Organization details, tax status, contact information, donation checkout and form delivery are intentionally unconfigured. The contact forms and online giving stay unavailable until verified details and services are added. `robots.txt` currently blocks crawlers; change it only when the public launch is approved.

The custom-domain file, canonical URLs and sitemap refer to `safeerah.org`. The Pages workflow is manual-only, so pushing to `main` does not publish the site. This repository change does not publish the site, configure GitHub Pages, enable HTTPS, or change DNS.

## Prelaunch checklist

- Confirm the legal organization name, tax status, EIN, charitable-solicitation requirements and public disclosures with the appropriate organization representatives and counsel. Add only verified details to `assets/js/config.js` and the transparency page.
- Decide which mailing address and contact email are approved for public display; update the placeholders and test the contact and newsletter forms after configuring a delivery endpoint.
- Add a privacy policy reviewed for the organization's services and applicable requirements, plus approved donation/refund terms, before collecting personal information or accepting gifts.
- Select and configure a donation processor, confirm its fees and eligibility requirements, then test hosted checkout or the embedded form, designations, recurring gifts, receipts and the full donor experience.
- Add confirmed leadership, financial and governance records where applicable. Verify program descriptions and any impact or gift-designation language before publishing them.
- Use only rights-cleared photographs and artwork. Obtain family approval before adding Safeerah's photo and written permission before naming or depicting partner organizations.
- Check keyboard navigation, screen-reader labels, color contrast, reduced motion, mobile layout, both color themes and all links/forms on a phone and desktop.
- Before launch, review the Pages deployment workflow and account settings, configure the domain and HTTPS through the responsible account owner, remove or replace every launch placeholder, and change `robots.txt` to allow crawling. Only then should an authorized owner manually run the Pages workflow. It stages an explicit public file list so the internal `logo-options.html` design page and repository files are not included.

The tree-and-bird logo asset is a PNG with an alpha channel and is used without a background fill. The site theme follows the visitor's system preference on first visit, stores an explicit choice when browser storage is available, and provides a light/dark toggle.
