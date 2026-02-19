import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase
    .from("cabins")
    .select("*");

  if (error) {
    console.log(error);
    throw new Error("Error in loading Cabins");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName =
    `${Math.random()}-${newCabin.image.name}`.replaceAll(
      "/",
      "",
    );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  //https://ycckpclbgmmefvuzqolp.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
  //1. Create Cabin
  let query = supabase.from("cabins");

  //A)Create
  if (!id)
    query = query.insert([{ ...newCabin, image: imagePath }]);

  //B) Edit
  if (id)
    query = query
      .update({ ...newCabin, image: imagePath })
      .eq("id", id);

  const { data, error } = await query.select().single();

  if (id)
    if (error) {
      console.log(error);
      throw new Error("Error in creating Cabins");
    }

  //2. Upload image.
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  //3. Delete the cabin if there was an error in the uploading image
  if (storageError) {
    const idToDelete = data[0]?.id;
    if (idToDelete) {
      await supabase
        .from("cabins")
        .delete()
        .eq("id", idToDelete);
    }
    throw new Error(
      "Error in uploading Images... Cabins cannot create",
    );
  }

  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase
    .from("cabins")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    throw new Error("Error in deleting Cabins");
  }
}
