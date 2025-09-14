import { CollectionConfig } from "payload";

const Team: CollectionConfig = {
  slug: "team-members",
  labels: {
    singular: "Team Member",
    plural: "Team Members",
  },
  admin: {
    useAsTitle: "name", // shows "name" in list view
  },
  access: {
    read: () => true, // allow public read
    // create: ({ req: { user } }) => Boolean(user),
    create: () => true, // allow public create
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      unique: true, // ensures no duplicate emails
    },
    {
      name: "designation",
      label: "Designation",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
    {
      name: "socialLinks",
      label: "Social Links",
      type: "group",
      fields: [
        {
          name: "linkedin",
          type: "text",
        },
        {
          name: "twitter",
          type: "text",
        },
        {
          name: "github",
          type: "text",
        },
      ],
    },
    {
      name: "website",
      label: "Website",
      type: "text",
    },
    {
      name: "image",
      label: "Image",
      type: "text",
      required: true,
    },
  ],
  timestamps: true, // creates createdAt & updatedAt automatically
};

export default Team;
