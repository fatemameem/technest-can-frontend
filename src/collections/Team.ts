import type { CollectionConfig } from "payload";

const Team: CollectionConfig = {
  slug: "team-members",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "designation",
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
      type: "upload",
      label: "Profile Image",
      relationTo: "media",
      required: true, // Make the new field required instead
    },
  ],
  timestamps: true,
};

export default Team;
