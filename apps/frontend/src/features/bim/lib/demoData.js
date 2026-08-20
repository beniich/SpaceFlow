export const DEMO_TREE = {
  id: "building-root",
  guid: "a2b98d7e-1c4f-4a8b-9d2e-7f6g5h4i3j2k",
  name: "Building (Office Tower A)",
  type: "building",
  status: "operational",
  children: [
    {
      id: "floors-folder",
      name: "Floors",
      type: "folder",
      children: [
        { id: "l1", guid: "l1-guid", name: "L1", type: "floor", count: 12, children: [] },
        { id: "l2", guid: "l2-guid", name: "L2", type: "floor", count: 2, children: [] },
        { id: "l3", guid: "l3-guid", name: "L3...", type: "floor", count: 12, children: [] },
      ],
    },
    {
      id: "hvac-folder",
      name: "HVAC",
      type: "folder",
      children: [
        {
          id: "ahu1",
          guid: "ahu1-guid",
          name: "AHU-1",
          type: "asset",
          status: "operational",
          assetType: "Air Handling Unit",
          material: "Steel, Aluminum",
          thickness: "2mm Casing",
          temperature: 20.8,
          airflow: 1500,
          lastMaintenance: "2023-10-27",
          heatValue: 22,
          location: "Rooftop Mechanical",
        },
        {
          id: "ahu2",
          guid: "a2b98d7e-1c4f-4a8b-9d2e-7f6g5h4i3j2k",
          name: "AHU-2 - HVAC",
          type: "asset",
          status: "operational",
          assetType: "Air Handling Unit",
          material: "Steel, Aluminum",
          thickness: "2mm Casing",
          temperature: 21.5,
          airflow: 1500,
          lastMaintenance: "2023-10-27",
          heatValue: 78,
          expressID: 142,
          location: "L2 Mechanical Room",
        },
      ],
    },
    {
      id: "ducts-folder",
      name: "Ducts...",
      type: "folder",
      count: 2,
      children: [],
    },
    {
      id: "pipes-folder",
      name: "Pipes",
      type: "folder",
      children: [
        { id: "water", name: "Water", type: "system", count: 18, children: [] },
        { id: "gas", name: "Gas", type: "system", count: 2, children: [] },
        { id: "drainage", name: "Drainage", type: "system", count: 8, children: [] },
      ],
    },
    {
      id: "electrical-folder",
      name: "Electrical",
      type: "folder",
      children: [
        { id: "panels", name: "Panels", type: "system", count: 10, children: [] },
        { id: "circuits", name: "Circuits", type: "system", count: 3, children: [] },
        { id: "lights", name: "Lights", type: "system", count: 5, children: [] },
      ],
    },
  ],
};

export function buildIndex(tree) {
  const index = {};
  const walk = (node) => {
    if (node.id) index[node.id] = node;
    if (node.guid) index[node.guid] = node;
    node.children?.forEach(walk);
  };
  walk(tree);
  return index;
}
