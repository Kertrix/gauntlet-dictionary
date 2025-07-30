import { ReactElement, useEffect, useState } from 'react';
import { Detail, Icons, List } from "@project-gauntlet/api/components";
import { useFetch } from '@project-gauntlet/api/hooks';
import { WordDefinition } from './types';

export default function Search(): ReactElement {
    const [searchDictWord, setSearchDictWord] = useState<string | undefined>("");
    const [words, setWords] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = (value: string | undefined) => {
        console.log(`Searching for: ${value}`);
        setSearchDictWord(value);
        if (value) {
            setIsLoading(true);
            fetch(`https://api.datamuse.com/words?sp=${value}*`)
                .then(response => response.json())
                .then(data => setWords(data.map((item: any) => item.word)))
                .catch(error => {
                    console.error(`Failed to fetch words:`, error);
                })
                .finally(() => setIsLoading(false));
        } else {
            setWords([]);
        }
    }

    const [id, setId] = useState<string | undefined>("")

    useEffect(() => {
        console.log("Search word: " + searchDictWord)
        console.log("Selected word ID: " + id)
    }, [searchDictWord, id]);

    return (
        <List onItemFocusChange={setId} isLoading={isLoading}>
            <List.SearchBar
                placeholder="Search for a word..."
                value={searchDictWord}
                onChange={handleSearch}
            />
            {searchDictWord && words.length > 0 ? (
                words.slice(0, 10).map(word => (
                    <List.Item id={word} title={word} key={word} />
                ))
            ) : (
                null
            )}

            {isLoading ? (
                <List.EmptyView title='Searching...' />
            ) : !searchDictWord ? (
                <List.EmptyView title={`Search for word meanings`} />
            ) : (
                <List.EmptyView title='No results :(' image={Icons.Stop} />
            )}

            {searchDictWord && words.length > 0 && id && (
                <WordDetail word={id} />
            )}
        </List>
    );
};

function WordDetail({ word }: { word: string | undefined }): ReactElement {
    const { data, error, isLoading } = useFetch<WordDefinition>(
        "https://freedictionaryapi.com/api/v1/entries/en/" + encodeURIComponent(word || "")
    );

    return (
        <List.Detail isLoading={isLoading}>
            <List.Detail.Content>
                {error ? (
                    <List.Detail.Content.Paragraph>Error loading definition</List.Detail.Content.Paragraph>
                ) : !data?.entries?.length ? (
                    <List.Detail.Content.Paragraph>No definition found for "{word}"</List.Detail.Content.Paragraph>
                ) : (
                    <>
                        <List.Detail.Content.H4>{word}</List.Detail.Content.H4>
                        {data.entries.map((entry, index) => (
                            <>
                                <List.Detail.Content.H6 key={index}>
                                    {entry.partOfSpeech} {index}  —  {entry.pronunciations[0]?.text || "No pronunciation available"}
                                </List.Detail.Content.H6>
                                <List.Detail.Content.Paragraph>
                                    {entry.senses.map((sense, index) => `${index + 1}.  ${sense.definition}`).join('\n')}
                                </List.Detail.Content.Paragraph>
                            </>
                        ))}
                        <List.Detail.Content.HorizontalBreak />
                        <List.Detail.Content.Paragraph>
                            Source: {data?.source.url} ({data?.source.license.name})
                        </List.Detail.Content.Paragraph>
                    </>
                )}
            </List.Detail.Content>
        </List.Detail>
    );
}