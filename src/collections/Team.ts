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
  hooks: {
    afterDelete: [
      async ({ doc, req }) => {
        // Clean up profile image when team member is deleted
        if (doc.image) {
          const imageId = typeof doc.image === 'string' ? doc.image : doc.image.id;
          if (imageId) {
            try {
              await req.payload.delete({
                collection: 'media',
                id: imageId,
                overrideAccess: true,
              });
              console.log(`✅ Deleted profile image ${imageId} from team member deletion`);
            } catch (error) {
              console.error(`❌ Error deleting profile image ${imageId}:`, error);
            }
          }
        }
      },
    ],
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        if (!data || !originalDoc) return data;

        // Check if profile image was replaced
        if (originalDoc.image && data.image) {
          const oldImageId = typeof originalDoc.image === 'string' ? originalDoc.image : originalDoc.image.id;
          const newImageId = typeof data.image === 'string' ? data.image : data.image?.id;
          
          if (oldImageId && newImageId && oldImageId !== newImageId) {
            try {
              await req.payload.delete({
                collection: 'media',
                id: oldImageId,
                overrideAccess: true,
              });
              console.log(`✅ Deleted replaced profile image ${oldImageId}`);
            } catch (error) {
              console.error(`❌ Error deleting replaced profile image ${oldImageId}:`, error);
            }
          }
        }

        return data;
      },
    ],
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
