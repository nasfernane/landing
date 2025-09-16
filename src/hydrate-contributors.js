(async function hydrateContributorsIIFE() {
  const coreRow = document.getElementById("core-row");
  const commitersRow = document.getElementById("contributors-row");

  const response = await fetch("https://raw.githubusercontent.com/NodeSecure/Governance/main/contributors.json");

  if (!response.ok) {
    throw new Error(`Error while fetching contributors list: ${response.status}`);
  }

  const contributors = await response.json();

  for (const coreContributor of contributors.core) {
    const contributorElement = createContributorElement(coreContributor, "core");
    coreRow.appendChild(contributorElement);
  }

  for (const contributor of contributors.committers) {
    const contributorElement = createContributorElement(contributor);
    commitersRow.appendChild(contributorElement);
  }
}());

function createContributorElement(data, type = "contributor") {
  const cLink = document.createElement("a");

  cLink.href = `https://github.com/${data.github}`;
  cLink.target = "_blank";
  cLink.className = `${type}-avatar`;

  const img = document.createElement("img");
  img.src = `https://github.com/${data.github}.png`;
  img.alt = data.name;

  const nameDiv = document.createElement("div");
  nameDiv.className = `${type}-name`;
  nameDiv.textContent = data.name;

  cLink.appendChild(img);
  cLink.appendChild(nameDiv);

  return cLink;
}
