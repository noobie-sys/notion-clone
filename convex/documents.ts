import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";



export const archive  = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }
      const userId = identity.subject;

      const existingDocuments = await ctx.db.get(args.id);
      if (!existingDocuments) {
        throw new Error("Not Found");
      }
      if (existingDocuments.userId !== userId) {
        throw new Error("Unauthorize");
      }
      const recursiveArchive = async (documentId: Id<"documents">) => {
        const children = await ctx.db
          .query("documents")
          .withIndex("by_user_parent", (q) =>
            q.eq("userId", userId).eq("parentDocument", documentId)
          )
          .collect();
        for (const child of children) {
          await ctx.db.patch(child._id, {
            isArchive: true,
          });
          await recursiveArchive(child._id);
        }
      };
      const document = await ctx.db.patch(args.id, { isArchive: true });
      recursiveArchive(args.id);
      return document;
    },
  });

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchive"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const userId = identity.subject;
    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchive: false,
      isPublished: false,
    });
    return document;
  },
});


export const getTrash = query({
  handler : async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const documents = await ctx.db.query("documents")
    .withIndex("by_user" , (q) => q.eq("userId" , userId))
    .filter((q )=> q.eq(q.field("isArchive") , true)).order("desc").collect()

    return documents
  }
})


export const restore = mutation({
  args : {
     id : v.id("documents")
  },
  handler : async (ctx , args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const existingDocuments = await ctx.db.get(args.id);
    if(!existingDocuments) {
      throw new Error("Document not found!")
    }
    if(existingDocuments.userId !== userId){
      throw new Error("Not authorised!")
    }
    const recursiveRestore = async (documentId : Id<"documents">) => {
      const children = await ctx.db.query("documents")
      .withIndex("by_user_parent" , q =>
        q.eq("userId" , userId).eq("parentDocument" , documentId)
      ).collect()

      for(const child of children) {
       await ctx.db.patch(child._id , {
        isArchive : false
       })
       await recursiveRestore(child._id)
      }
    }
    const options : Partial<Doc<"documents">>  = {
      isArchive : false
    }
    if(existingDocuments.parentDocument){
      const parent = await ctx.db.get(existingDocuments.parentDocument);
      if(parent?.isArchive){
        options.parentDocument = undefined
      }
    }
    const document = await ctx.db.patch(args.id , options)
    recursiveRestore(args.id)
    return document;
  }
})


export const remove = mutation({
  args : {id : v.id("documents")},
  handler : async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const existingDocuments = await ctx.db.get(args.id);
    // console.log(existingDocuments?._id , userId)
    if(!existingDocuments) {
      throw new Error("Not Found")
    }
    if(existingDocuments.userId !== userId){
      throw new Error("Not Authorized")
    }

    const document = await ctx.db.delete(args.id)
    return document;
  },
})