import SheskaCardDef from "src/components/Utils/SheskaCardDef";
import {useCallback, useEffect, useState} from "react";
import {getSheskaCardImagesUrls} from "src/components/Utils/CardUtil";
import {auth, storage} from "src/index";
import {Progress} from "src/components/ui/progress";
import {BadgeCheck} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "src/components/ui/tooltip";

export function PublishedMiniCard( props: { cardSchema : SheskaCardDef, setIdCard : any} ) {
    const [slideImages, setSlideImages] = useState([] as string[]);
    const [progress, setProgress] = useState(0);
    const fetchImages = useCallback(async () => {
        return getSheskaCardImagesUrls(props.cardSchema.cardID, storage, auth)
            .then((response) => {
                setSlideImages(response);
            })
            .catch((error) => console.error(error));
    }, [props.cardSchema.cardID]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);
    useEffect(() => {
        const timer = setTimeout(() => setProgress(66), 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div>
            <div className={` relative hover:scale-110 transition-all drop-shadow-xl border-b-gray-400r ${slideImages.length <= 0 ?
                "mw-100 aspect-square b bg-card border-b-gray-400 rounded-md flex flex-col justify-start" : ''}`}
                onClick={() => {props.setIdCard(props.cardSchema.cardID)}}>

                {slideImages.length <= 0 && <h1 className={"font-serif text-6xl text-primary font-black mt-3 ml-3"}>S</h1>}
                {slideImages.length > 0 && <img src={slideImages[0]} className={'rounded-md object-cover aspect-square'}></img>}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild={true}>
                            <BadgeCheck className={`absolute top-3 right-3 hover:scale-110 opacity-70 stroke-2`} size={'36px'}/>
                        </TooltipTrigger>
                        <TooltipContent side={"top"} align={'end'} avoidCollisions={true}>
                            <p>Card is Published!</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <h2 className={`font-serif text-4xl font-medium drop-shadow-2xl w-3/4 
            ${slideImages.length > 0 ? 'text-white absolute left-2 top-2 ' : 'text-black ml-3'}`}>{props.cardSchema.title}</h2>
                <Progress className={`${slideImages.length <= 0 ? 'mt-auto mb-4' : 'bottom-4'}`} value={progress} />
            </div>
        </div>

    )
}

export default PublishedMiniCard;