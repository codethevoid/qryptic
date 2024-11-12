export async function fetchAndCreateTSFile(url: string) {
  try {
    // Step 1: Fetch the file content from S3
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error fetching file: ${response.statusText}`);

    const fileContent = await response.text();

    // Step 2: Split the content by new line to create an array
    const linesArray = fileContent.split(/\r?\n/);

    // Step 3: Convert the array into a comma-separated string
    const arrayString = `const dataArray = [${linesArray.map((line) => `"${line}"`).join(", ")}];\nexport default dataArray;`;

    // Step 4: Create a blob and download it as a .js file
    const blob = new Blob([arrayString], { type: "text/javascript" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "dataArray.ts";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("TS file created successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}
