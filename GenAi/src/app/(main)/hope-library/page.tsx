import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const hopeItems = [
  {
    id: "hope-1",
    type: "Story",
    content: "An anonymous user shared how connecting with a friend after weeks of isolation helped them turn a corner. 'Just one conversation can make all the difference,' they wrote.",
    image: PlaceHolderImages.find((img) => img.id === "1"),
  },
  {
    id: "hope-2",
    type: "Quote",
    content: "'The oak fought the wind and was broken, the willow bent when it must and survived.' - Robert Jordan",
    image: PlaceHolderImages.find((img) => img.id === "2"),
  },
  {
    id: "hope-3",
    type: "Experience",
    content: "Someone shared their journey of learning to celebrate small victories. 'I used to only focus on big goals. Now, I find joy in finishing a small task. It's less pressure and more happiness.'",
    image: PlaceHolderImages.find((img) => img.id === "3"),
  },
];


export default function HopeLibraryPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">Hope Library</h1>
        <p className="text-muted-foreground">
          A collection of inspiring stories, uplifting quotes, and shared experiences.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hopeItems.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader className="p-0">
              {item.image && (
                <Image
                  src={item.image.imageUrl}
                  alt={item.image.description}
                  width={600}
                  height={400}
                  className="rounded-t-lg object-cover aspect-video"
                  data-ai-hint={item.image.imageHint}
                />
              )}
            </CardHeader>
            <CardContent className="flex-1 pt-6">
              <p className="text-muted-foreground leading-relaxed">{item.content}</p>
            </CardContent>
            <CardFooter>
                <span className="text-xs font-semibold uppercase text-primary tracking-wider">{item.type}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
